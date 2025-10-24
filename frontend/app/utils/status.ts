export const lcStatus: Record<string, string> = {
    pendingFunding: "Awaiting Funding",
    documentSubmitted: "Document Submitted",
    awaitingSeller: "Awaiting Seller",
    funded: "Funded",
    active: "Active",
    completed: "Completed",
    refunded: "Refunded",
    cancelled: "Cancelled",
}

export const lcStatusColor: Record<string, string> = {
    pendingFunding: "rgba(250, 115, 25, 1)",      // Vivid Orange
    documentSubmitted: "#00B8D9",  // Bright Cyan
    awaitingSeller: "#FFD600",      // Bright Yellow
    funded: "rgba(51, 92, 255, 1)",              // Vivid Green
    active: "rgba(31, 193, 107, 1)",              // Bright Blue
    completed: "rgba(123, 123, 123, 1)",           // Bright Green
    refunded: "#D500F9",            // Vivid Purple
    cancelled: "#D32F2F",           // Vivid Red
}