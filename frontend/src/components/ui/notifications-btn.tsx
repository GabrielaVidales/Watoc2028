// import {
//     ArrowUpIcon,
//     GlobeIcon,
//     ImageIcon,
//     MessageCircleDashedIcon,
//     PaperclipIcon,
//     PlusIcon,
//     RotateCwIcon,
//     TelescopeIcon,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//     Card,
//     CardAction,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//     Empty,
//     EmptyDescription,
//     EmptyHeader,
//     EmptyMedia,
//     EmptyTitle,
// } from "@/components/ui/empty"
// import {
//     InputGroup,
//     InputGroupAddon,
//     InputGroupButton,
// } from "@/components/ui/input-group"
// import {
//     MessageScroller,
//     MessageScrollerButton,
//     MessageScrollerContent,
//     MessageScrollerProvider,
//     MessageScrollerViewport,
// } from "@/components/ui/message-scroller"
// import {
//     Tooltip,
//     TooltipContent,
//     TooltipTrigger,
// } from "@/components/ui/tooltip"

// export function MessageScrollerDemo() {

//     const isBusy = status === "submitted" || status === "streaming"

//     return (
//         <MessageScrollerProvider>
//             <div className="relative flex flex-col gap-4">
//                 <Card className="mx-auto h-140 w-full max-w-sm gap-0">
//                     <CardHeader className="gap-1 border-b">
//                         <CardTitle>New Chat</CardTitle>
//                         <CardDescription>How can I help you today?</CardDescription>
//                         <CardAction>
//                             <Tooltip>
//                                 <TooltipTrigger asChild>
//                                     <Button
//                                         variant="outline"
//                                         size="icon"
//                                         aria-label="Reset conversation"
//                                         disabled={isBusy}
//                                     >
//                                         <RotateCwIcon />
//                                     </Button>
//                                 </TooltipTrigger>
//                                 <TooltipContent>
//                                     <p>Reset</p>
//                                 </TooltipContent>
//                             </Tooltip>
//                         </CardAction>
//                     </CardHeader>
//                     <CardContent className="flex-1 overflow-hidden p-0">
//                         {messages.length === 0 ? (
//                             <Empty className="h-full">
//                                 <EmptyHeader>
//                                     <EmptyMedia variant="icon">
//                                         <MessageCircleDashedIcon />
//                                     </EmptyMedia>
//                                     <EmptyTitle>Morning, shadcn!</EmptyTitle>
//                                     <EmptyDescription>
//                                         What are we working on today? Press send to start a new
//                                         conversation
//                                     </EmptyDescription>
//                                 </EmptyHeader>
//                             </Empty>
//                         ) : (
//                             <MessageScroller>
//                                 <MessageScrollerViewport>
//                                     <MessageScrollerContent
//                                         aria-busy={isBusy}
//                                         className="p-(--card-spacing)"
//                                     >
//                                         {messages.map((message) => (
//                                             <MessageAnimated
//                                                 key={message.id}
//                                                 message={message}
//                                                 scrollAnchor={message.role === "user"}
//                                             />
//                                         ))}
//                                     </MessageScrollerContent>
//                                 </MessageScrollerViewport>
//                                 <MessageScrollerButton />
//                             </MessageScroller>
//                         )}
//                     </CardContent>
//                     <CardFooter className="flex-col gap-2">
//                         <form
//                             onSubmit={(e) => {
//                                 e.preventDefault()
//                                 if (!nextMessage || isBusy) {
//                                     return
//                                 }
//                                 void sendMessage(nextMessage)
//                             }}
//                             className="w-full"
//                         >
//                             <InputGroup>
//                                 <div className="h-14 w-full px-3 py-2.5">
//                                     <span
//                                         className="line-clamp-2 opacity-60 data-[status=ready]:opacity-100"
//                                         data-status={status}
//                                     >
//                                         {nextMessage ? (
//                                             getMessageText(nextMessage)
//                                         ) : (
//                                             <span className="text-muted-foreground">
//                                                 No messages queued. Reset the conversation.
//                                             </span>
//                                         )}
//                                     </span>
//                                 </div>
//                                 <InputGroupAddon align="block-end" className="pt-1">
//                                     <DropdownMenu>
//                                         <DropdownMenuTrigger asChild>
//                                             <InputGroupButton
//                                                 aria-label="Add files"
//                                                 type="button"
//                                                 size="icon-sm"
//                                                 variant="outline"
//                                             >
//                                                 <PlusIcon />
//                                             </InputGroupButton>
//                                         </DropdownMenuTrigger>
//                                         <DropdownMenuContent
//                                             align="start"
//                                             side="top"
//                                             className="w-44"
//                                         >
//                                             <DropdownMenuItem>
//                                                 <PaperclipIcon />
//                                                 Add Photos & Files
//                                             </DropdownMenuItem>
//                                             <DropdownMenuSeparator />
//                                             <DropdownMenuItem>
//                                                 <ImageIcon />
//                                                 Create Image
//                                             </DropdownMenuItem>
//                                             <DropdownMenuItem>
//                                                 <TelescopeIcon />
//                                                 Deep Research
//                                             </DropdownMenuItem>
//                                             <DropdownMenuItem>
//                                                 <GlobeIcon />
//                                                 Web Search
//                                             </DropdownMenuItem>
//                                         </DropdownMenuContent>
//                                     </DropdownMenu>
//                                     <InputGroupButton
//                                         type="submit"
//                                         variant="default"
//                                         size="icon-sm"
//                                         disabled={!nextMessage || isBusy}
//                                         className="ml-auto"
//                                     >
//                                         <ArrowUpIcon />
//                                         <span className="sr-only">Send</span>
//                                     </InputGroupButton>
//                                 </InputGroupAddon>
//                             </InputGroup>
//                         </form>
//                     </CardFooter>
//                 </Card>
//                 <div className="px-0.5 text-center text-xs text-muted-foreground">
//                     Demo is read only. Press send to send messages.
//                 </div>
//             </div>
//         </MessageScrollerProvider>
//     )
// }
