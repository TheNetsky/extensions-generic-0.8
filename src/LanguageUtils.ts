import {
    Months,
    TimeAgo
} from './MangaStreamInterfaces'

export function convertDate(dateString: string, source: any): Date {
    // Parsed date string
    dateString = dateString.toLowerCase()

    // Month formats provided by the source
    const dateMonths: Months = source.dateMonths

    let date: Date | null = null
    Object.entries(dateMonths).forEach(([key, value]) => {
        if (dateString.toLowerCase().includes(value?.toLowerCase())) {
            date = new Date(dateString.replace(value, key ?? ''))
        }
    })

    if (!date || String(date) == 'Invalid Date') {
        console.log('Failed to parse chapter date! TO DEV: Please check if the entered months reflect the sites months')
        return new Date()
    }
    return date
}

// No longer being used since this was used to check for updates, however keeping this here in case for future updates
export function convertDateAgo(dateString: string, source: any): Date | null {
    // Parsed date string
    dateString = dateString.toLowerCase()

    // Time ago formats provided by the source
    const dateTimeAgo: TimeAgo = source.dateTimeAgo

    // Fetch the type of time
    let timeType: string | null = null
    Object.entries(dateTimeAgo).forEach(([key, value]) => {
        // For each type, loop through all available strings
        for (const type of value) {
            if (dateString.toLowerCase().includes(type?.toLowerCase())) {
                timeType = key
            }
        }
    })

    // Now we have the type of time that has passed, this can be anything from a "week" to a "year".

    // Now we need to get the amount of time that has passed.
    let timeAgoAmount: number | null = null
    const RegExAgoAmount = /(\d+)/.exec(dateString)
    if (RegExAgoAmount && RegExAgoAmount[1]) timeAgoAmount = Number(RegExAgoAmount[1])
    if (!timeAgoAmount || isNaN(timeAgoAmount) || !timeType) {
        console.log(`Failed to parse time ago format! Either timeType:${timeType} or timeAgoAmount:${timeAgoAmount} is null.`)
        //Since this isn't really important, log it and return null. These titles will just be excluded from the updated section.
        return null
    }
    // Now we have the time type and number.

    // Now we generate the new date!
    let time: Date | null = null
    switch (timeType) {
        case 'now':
            time = new Date(Date.now())
            break
        case 'yesterday':
            time = new Date(Date.now() - 86400000)
            break
        case 'years':
            time = new Date(Date.now() - (timeAgoAmount * 31556952000))
            break
        case 'months':
            time = new Date(Date.now() - (timeAgoAmount * 2592000000))
            break
        case 'weeks':
            time = new Date(Date.now() - (timeAgoAmount * 604800000))
            break
        case 'days':
            time = new Date(Date.now() - (timeAgoAmount * 86400000))
            break
        case 'hours':
            time = new Date(Date.now() - (timeAgoAmount * 3600000))
            break
        case 'minutes':
            time = new Date(Date.now() - (timeAgoAmount * 3600000))
            break
        case 'seconds':
            time = new Date(Date.now() - (timeAgoAmount * 3600000))
            break
        default:
            time = null
            break
    }

    if (String(time) == 'Invalid Date') time = null // Check if it's valid or not, if not return null, parser will know what to do!
    return time
}