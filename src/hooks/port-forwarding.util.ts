import { ArchivistDebugInfo, SafeValue, ArchivistError } from "@durability-labs/archivist-sdk-js"

export const PortForwardingUtil = {
    check: (ip: string, port: number) => {
        const headers = {
            "X-Real-IP-Custom": ip
        }

        return fetch(import.meta.env.VITE_GEO_IP_URL + "/port/" + port, { headers })
            .then((res) => res.json())
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