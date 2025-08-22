import { ArchivistDebugInfo, SafeValue, ArchivistError } from "@durability-labs/archivist-sdk-js"

export const HealthCheckUtils = {
    removePort(url: string) {
        const parts = url.split(":")
        return parts[0] + ":" + parts[1]
    },

    /*
    * Extract the port from a protocol + ip + port string
    */
    getPort(url: string) {
        return parseInt(url.split(":")[2] || "80", 10)
    },

    containsPort(url: string) {
        return url.split(":").length > 2
    },

    isUrlInvalid(url: string) {
        try {
            new URL(url)
            return false
            // We do not need to manage the error because we want to check 
            // if the URL is valid or not only.
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            return true
        }
    },

    extractAnnounceAddresses(announceAddresses: string[]): SafeValue<string> {
        if (announceAddresses.length === 0) {
            return { error: true, data: new ArchivistError("Not existing announce address") }
        }


        const ip = announceAddresses[0].split("/")

        if (ip.length !== 5) {
            return { error: true, data: new ArchivistError("Misformatted ip") }
        }

        return { error: false, data: ip[2] }
    },

    getTcpPort(info: ArchivistDebugInfo): SafeValue<number> {
        if (info.addrs.length === 0) {
            return { error: true, data: new ArchivistError("Not existing address") }
        }

        const parts = info.addrs[0].split("/")

        if (parts.length < 2) {
            return { error: true, data: new ArchivistError("Address misformatted") }
        }

        const port = parseInt(parts[parts.length - 1], 10)

        if (isNaN(port)) {
            return { error: true, data: new ArchivistError("Port misformatted") }
        }

        return { error: false, data: port }
    }
}