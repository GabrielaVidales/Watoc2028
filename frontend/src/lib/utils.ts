import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function scrollToElement(id: string, yOffset: number = 0) {
    const element = document.getElementById(id);

    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - yOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

export const toSnakeCase = (obj: Record<string, any>): Record<string, any> => {
    return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        acc[snakeKey] = obj[key];
        return acc;
    }, {} as Record<string, any>);
};


export const getFileSize = (file: File | number) => {
    let i = 0;
    let size = file instanceof File ? file.size : file;
    while (size > 900) {
        size /= 1024;
        i++;
    }
    const units = ['Bytes', 'KB', 'MB', 'GB'];
    const exactSize = (Math.round(size * 100) / 100) + ' ' + units[i];
    return exactSize;
};


export const countWords = (input: string) => {
    if (!input) return 0

    return input
        .split(/\s+/)
        .filter(Boolean)
        .length
}

export const countWordsBelowLimit = (input: string, limit: number) => countWords(input) <= limit






export type RouteLeafValue =
    | string
    | ((...args: never[]) => string)
    | { pattern?: string; template?: string; path?: string }

export interface RouteLeafNode {
    kind: "leaf"
    key: string
    /** Object key path, e.g. ["users", "submissions", "summary"]. */
    keyPath: string[]
    /** Route pattern with params, e.g. "/user/submissions/edit/:id". */
    pattern: string
    paramNames: string[]
    regex: RegExp
    /** Static segment count, used to rank competing matches. */
    score: number
}

export interface RouteGroupNode {
    kind: "group"
    key: string
    keyPath: string[]
    /** Inferred (or explicit) base path of the group, e.g. "/user/submissions". */
    base: string
    /** Set when a child resolves exactly to `base` (an index route). */
    indexPattern?: string
    children: RouteNode[]
}

export type RouteNode = RouteLeafNode | RouteGroupNode

export interface RouteMatch {
    node: RouteLeafNode
    params: Record<string, string>
    pathname: string
}

export interface Crumb {
    /** Object key this crumb came from ("submissions"), or "" for the root. */
    key: string
    /** Dotted key path, useful as a label-override key ("users.submissions"). */
    id: string
    label: string
    /** Absent when the segment has no navigable route of its own. */
    href?: string
    isCurrent: boolean
    params: Record<string, string>
}

export interface BreadcrumbOptions {
    /** Label overrides, keyed by dotted key path or by plain key. */
    labels?: Record<string, string>
    /** Prepend a crumb for "/" (default: true). */
    showRoot?: boolean
    rootLabel?: string
    rootHref?: string
    /**
     * When the pathname matches no known route, derive crumbs from the URL
     * segments instead of returning nothing (default: true).
     */
    fallbackToPathSegments?: boolean
}

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

/** "/user//submissions/" -> "/user/submissions"; "" -> "/" */
export function normalizePath(path: string): string {
    const cleaned = `/${path}`.replace(/\/{2,}/g, "/").replace(/\/+$/, "")
    return cleaned === "" ? "/" : cleaned
}

const toSegments = (path: string): string[] =>
    normalizePath(path).split("/").filter(Boolean)

const isRootPath = (path: string): boolean => normalizePath(path) === "/"

// ---------------------------------------------------------------------------
// Pattern extraction
// ---------------------------------------------------------------------------

const PATTERN_KEYS = ["pattern", "template", "path", "raw", "route"] as const

/**
 * Gets the route pattern out of a leaf value. Strings are returned as-is.
 * For `routeWithParams` results (functions) it looks for a `pattern`-ish
 * property first, then falls back to calling the function with a proxy that
 * echoes `:name` for every property read — which reproduces the original
 * pattern for the usual `pattern.replace(":id", params.id)` implementations.
 */
export function getRoutePattern(value: unknown): string | null {
    if (typeof value === "string") return value.startsWith("/") || value === "" ? value : null

    if (value && typeof value === "object") {
        const record = value as Record<string, unknown>
        for (const key of PATTERN_KEYS) {
            const candidate = record[key]
            if (typeof candidate === "string" && candidate.startsWith("/")) {
                return candidate
            }
        }
        return null
    }

    if (typeof value !== "function") return null

    const fn = value as ((...args: never[]) => unknown) & Record<string, unknown>
    for (const key of PATTERN_KEYS) {
        const candidate = fn[key]
        if (typeof candidate === "string" && candidate.startsWith("/")) {
            return candidate
        }
    }

    try {
        const echo = new Proxy(
            {},
            {
                get: (_target, prop) => (typeof prop === "string" ? `:${prop}` : undefined),
                has: () => true,
            }
        )
        const result = (fn as unknown as (arg: unknown) => unknown)(echo)
        if (
            typeof result === "string" &&
            result.startsWith("/") &&
            !result.includes("[object")
        ) {
            return result
        }
    } catch {
        // Not a param builder we can introspect; treated as "not a route".
    }

    return null
}

// ---------------------------------------------------------------------------
// Tree building
// ---------------------------------------------------------------------------

function compileLeaf(
    key: string,
    keyPath: string[],
    pattern: string
): RouteLeafNode {
    const paramNames: string[] = []
    const source = toSegments(pattern)
        .map((segment) => {
            if (segment.startsWith(":")) {
                paramNames.push(segment.slice(1).replace(/[?*]$/, ""))
                return "([^/]+)"
            }
            return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        })
        .join("/")

    return {
        kind: "leaf",
        key,
        keyPath,
        pattern: normalizePath(pattern),
        paramNames,
        regex: new RegExp(`^/${source}/?$`, "i"),
        score: toSegments(pattern).length - paramNames.length * 0.5,
    }
}

function collectLeaves(node: RouteNode, into: RouteLeafNode[] = []) {
    if (node.kind === "leaf") into.push(node)
    else for (const child of node.children) collectLeaves(child, into)
    return into
}

/** Longest common path prefix of every descendant leaf. */
function inferBase(children: RouteNode[]): string {
    const patterns = children.flatMap((child) =>
        collectLeaves(child).map((leaf) => toSegments(leaf.pattern))
    )
    if (patterns.length === 0) return "/"

    const [first, ...rest] = patterns
    const common: string[] = []
    for (let i = 0; i < first.length; i++) {
        const segment = first[i]
        if (segment.startsWith(":")) break
        if (rest.every((segments) => segments[i] === segment)) common.push(segment)
        else break
    }
    return common.length ? `/${common.join("/")}` : "/"
}

/** Honour an explicitly declared base if the group exposes one. */
function explicitBase(value: Record<string, unknown>): string | null {
    for (const key of ["base", "$base", "root", "index"]) {
        const candidate = value[key]
        if (typeof candidate === "string" && candidate.startsWith("/")) {
            return normalizePath(candidate)
        }
    }
    return null
}

function buildNode(
    key: string,
    value: unknown,
    keyPath: string[]
): RouteNode | null {
    const pattern = getRoutePattern(value)
    if (pattern !== null) return compileLeaf(key, keyPath, pattern)

    if (!value || typeof value !== "object") return null

    const children = Object.entries(value as Record<string, unknown>)
        .map(([childKey, childValue]) =>
            buildNode(childKey, childValue, [...keyPath, childKey])
        )
        .filter((child): child is RouteNode => child !== null)

    if (children.length === 0) return null

    const base =
        explicitBase(value as Record<string, unknown>) ?? inferBase(children)

    // A child whose pattern *is* the base is the group's own page ("" or "/base").
    const indexChild = children.find(
        (child) => child.kind === "leaf" && child.pattern === normalizePath(base)
    ) as RouteLeafNode | undefined

    return {
        kind: "group",
        key,
        keyPath,
        base: normalizePath(base),
        indexPattern: indexChild?.pattern,
        children,
    }
}

export interface RouteTree {
    root: RouteGroupNode
    leaves: RouteLeafNode[]
}

export function buildRouteTree(urls: unknown): RouteTree {
    const node = buildNode("", urls, [])
    const root: RouteGroupNode =
        node && node.kind === "group"
            ? node
            : { kind: "group", key: "", keyPath: [], base: "/", children: [] }
    return { root, leaves: collectLeaves(root) }
}

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

export function matchRoute(
    tree: RouteTree,
    pathname: string
): RouteMatch | null {
    const path = normalizePath(pathname.split("?")[0].split("#")[0])

    let best: RouteMatch | null = null
    for (const leaf of tree.leaves) {
        const result = leaf.regex.exec(path)
        if (!result) continue

        const params: Record<string, string> = {}
        leaf.paramNames.forEach((name, index) => {
            params[name] = decodeURIComponent(result[index + 1] ?? "")
        })

        // Most static segments wins: "/user/abstract" beats "/user/:section".
        if (!best || leaf.score > best.node.score) {
            best = { node: leaf, params, pathname: path }
        }
    }
    return best
}

function fillParams(pattern: string, params: Record<string, string>): string {
    return normalizePath(
        pattern.replace(/:([A-Za-z0-9_]+)/g, (match, name: string) =>
            params[name] !== undefined ? encodeURIComponent(params[name]) : match
        )
    )
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

/** "manageUsers" -> "Manage users", "young-watoc" -> "Young watoc". */
export function humanizeKey(key: string): string {
    const words = key
        .replace(/([a-z\d])([A-Z])/g, "$1 $2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
        .replace(/[-_]+/g, " ")
        .trim()
    if (!words) return ""
    return words.charAt(0).toUpperCase() + words.slice(1).toLowerCase()
}

function resolveLabel(
    keyPath: string[],
    labels: Record<string, string> | undefined
): string {
    const key = keyPath[keyPath.length - 1] ?? ""
    return labels?.[keyPath.join(".")] ?? labels?.[key] ?? humanizeKey(key)
}

// ---------------------------------------------------------------------------
// Trail
// ---------------------------------------------------------------------------

/**
 * Walks the matched leaf's key path and turns each level into a crumb.
 *
 * - Groups without a page of their own ("users", "submissions") get no href and
 *   should render as plain text, not as a dead link.
 * - A leaf that resolves to its parent's base (`confirmAssistance.start: ""`)
 *   collapses into the parent instead of adding a redundant crumb.
 * - Root-level containers whose base is "/" (like `home`) never emit a crumb.
 */
export function getBreadcrumbs(
    tree: RouteTree,
    pathname: string,
    options: BreadcrumbOptions = {}
): Crumb[] {
    const {
        labels,
        showRoot = true,
        rootLabel = "Home",
        rootHref = "/",
        fallbackToPathSegments = true,
    } = options

    const path = normalizePath(pathname.split("?")[0].split("#")[0])
    const match = matchRoute(tree, path)
    const crumbs: Crumb[] = []

    if (showRoot) {
        crumbs.push({
            key: "",
            id: "",
            label: rootLabel,
            href: normalizePath(rootHref),
            isCurrent: false,
            params: {},
        })
    }

    if (!match) {
        if (fallbackToPathSegments && !isRootPath(path)) {
            toSegments(path).forEach((segment, index, all) => {
                const href = `/${all.slice(0, index + 1).join("/")}`
                crumbs.push({
                    key: segment,
                    id: all.slice(0, index + 1).join("."),
                    label: resolveLabel([segment], labels),
                    // Don't hand out links to paths that aren't real routes.
                    href: matchRoute(tree, href) ? href : undefined,
                    isCurrent: index === all.length - 1,
                    params: {},
                })
            })
        }
        return finalize(crumbs)
    }

    const { params } = match
    let node: RouteNode = tree.root

    for (let depth = 0; depth < match.node.keyPath.length; depth++) {
        if (node.kind !== "group") break
        const key = match.node.keyPath[depth]
        const child: RouteNode | undefined = node.children.find(
            (candidate) => candidate.key === key
        )
        if (!child) break
        node = child

        if (child.kind === "group") {
            // `home` and friends sit at "/" — the root crumb already covers them.
            if (isRootPath(child.base)) continue
            crumbs.push({
                key: child.key,
                id: child.keyPath.join("."),
                label: resolveLabel(child.keyPath, labels),
                href: child.indexPattern
                    ? fillParams(child.indexPattern, params)
                    : undefined,
                isCurrent: false,
                params,
            })
            continue
        }

        // A leaf that resolves to "/" *is* the root; the root crumb covers it.
        if (isRootPath(child.pattern)) continue

        // Leaf: skip when it only restates its parent's base (index route).
        const parentNode = findParent(tree.root, child)
        const isParentIndex =
            parentNode !== null &&
            parentNode.kind === "group" &&
            parentNode.indexPattern === child.pattern &&
            !isRootPath(parentNode.base)
        if (isParentIndex) continue

        crumbs.push({
            key: child.key,
            id: child.keyPath.join("."),
            label: resolveLabel(child.keyPath, labels),
            href: match.pathname,
            isCurrent: false,
            params,
        })
    }

    return finalize(crumbs)
}

function findParent(
    node: RouteGroupNode,
    target: RouteNode
): RouteGroupNode | null {
    for (const child of node.children) {
        if (child === target) return node
        if (child.kind === "group") {
            const found = findParent(child, target)
            if (found) return found
        }
    }
    return null
}

/** Marks the last crumb as current and drops its link. */
function finalize(crumbs: Crumb[]): Crumb[] {
    if (crumbs.length === 0) return crumbs
    const result = crumbs.map((crumb) => ({ ...crumb, isCurrent: false }))
    const last = result[result.length - 1]
    last.isCurrent = true
    last.href = undefined
    return result
}


const ELLIPSIS = "ellipsis" as const
type Item = Crumb | typeof ELLIPSIS


function collapse(crumbs: Crumb[], maxItems: number): Item[] {
    if (maxItems <= 0 || crumbs.length <= maxItems) return crumbs
    // Keep the first crumb, then an ellipsis, then the tail.
    const tail = crumbs.slice(crumbs.length - (maxItems - 2))
    return [crumbs[0], , ...tail]
}