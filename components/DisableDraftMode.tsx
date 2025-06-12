'use client'
import { useDraftModeEnvironment } from "next-sanity/hooks";
import { useRouter } from "next/navigation"
import { Button } from "./ui/button";

export function DisableDraftMode() {
    const environment = useDraftModeEnvironment()
    const router = useRouter()

    // Only show the disable draft mode button when outside of Presentation Tool
    if (environment !== "live" && environment !== "unknown") {
        return null;
    }

    const handleClick = async () => {
        await fetch("/draft-mode/disable")
        router.refresh()
    }

    return (
        <Button
            onClick={handleClick}
            variant="outline"
            size="sm"
            className="fixed bottom-4 right-4 bg-white hover:bg-gray-50 shadow-md border border-gray-200 rounded-md px-4 py-2 z-50 transition-colors duration-200">
            Disable Draft Mode
        </Button>
    )
}

export default DisableDraftMode