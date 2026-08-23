import React from "react"

function useTimeBefore(date: Date) {
    const [remainingTime, setRemainingTime] = React.useState({
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    React.useEffect(() => {
        const calculateTime = () => {
            const now = Date.now()
            const diff = date.getTime() - now

            if (diff < 0) {
                setRemainingTime({ weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
                return
            }

            setRemainingTime({
                weeks: Math.floor(diff / 604800000),
                days: Math.floor((diff % 604800000) / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            })
        }
        calculateTime()

        const interval = setInterval(calculateTime, 1000)

        return () => clearInterval(interval)
    }, [date.getTime()])

    return remainingTime
}

export default useTimeBefore