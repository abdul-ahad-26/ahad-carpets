'use client'
import { Category } from '@/sanity.types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { FiCheck, FiChevronDown } from 'react-icons/fi'

import { cn } from '@/lib/utils'




interface CategorySelectorProps {
    categories: Category[]
}

const CategorySelectorComponent = ({ categories }: CategorySelectorProps) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<string>("")
    const router = useRouter()



    return (
        // Main popover component that handles the category selection dropdown
        <Popover open={open} onOpenChange={setOpen} >
            {/* Trigger button that opens the popover */}
            <PopoverTrigger asChild>
                <Button variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className='w-full max-w-full relative flex justify-between  sm:flex-none items-center space-x-2  font-bold py-2 px-4 bg-[#1a3fa6] text-white rounded-full hover:bg-[#2563eb]'>
                    {/* Display selected category or default text */}
                    <div>{value ? categories.find((category) => category._id === value)?.title : "Filter by category "}</div>
                    <FiChevronDown className="ml-2 h-4 w-4 shrink-0 " />
                </Button>
            </PopoverTrigger>

            {/* Popover content containing the category search and selection interface */}
            <PopoverContent className="w-full p-0">
                <Command>
                    {/* Search input for filtering categories */}
                    <CommandInput
                        placeholder='Search category...'
                        className='h-9'
                        onKeyDown={(e) => {
                            // Handle Enter key press to select category from search
                            if (e.key === "Enter") {
                                const selectedCategory = categories.find((c) =>
                                    c.title?.toLocaleLowerCase().includes(e.currentTarget.value.toLowerCase())
                                )
                                if (selectedCategory?.slug?.current) {
                                    setValue(selectedCategory._id)
                                    router.push(`/categories/${selectedCategory.slug.current}`)
                                    setOpen(false)
                                }
                            }
                        }} />
                    <CommandList>
                        {/* Message shown when no categories match the search */}
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                            {/* Map through categories to create selectable items */}
                            {categories.map((category) => (
                                <CommandItem
                                    key={category._id}
                                    value={category.title}
                                    onSelect={() => {
                                        // Toggle selection and navigate to category page
                                        setValue(value === category._id ? "" : category._id);
                                        router.push(`/categories/${category.slug?.current}`);
                                        setOpen(false);
                                    }}
                                >
                                    {category.title}
                                    {/* Checkmark icon shown for selected category */}
                                    <FiCheck
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === category._id ? "opacity-100" : "opacity-0"
                                        )} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )


}

export default CategorySelectorComponent