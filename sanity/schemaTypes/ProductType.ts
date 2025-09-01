import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
    name: 'product',
    title: 'Products',
    type: 'document',
    icon: TrolleyIcon,
    fields: [
        defineField({
            name: "name",
            title: "Product Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({

            name: "images",
            title: "Product Image",
            type: "array",
            of: [
                {
                    type: "image",
                    options: {
                        hotspot: true,
                    },
                },
            ],
        }),
        defineField({
            name: "videoUrl",
            title: "Product Video (YouTube/Vimeo)",
            type: "url",
            description: "Paste YouTube or Vimeo link (use unlisted link for private videos)"
        }),

        defineField({
            name: "description",
            title: "Description",
            type: "blockContent",
        }),
        defineField({
            name: "price",
            title: "Price",
            type: "number",
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: "discount",
            title: "Discount Percentage",
            type: "number",
            validation: (Rule) => Rule.min(0).max(100),
        }),
        defineField({
            name: "category",
            title: "Categories",
            type: "array",
            of: [{ type: "reference", to: { type: "category" } }],
        }),
        defineField({
            name: "stock",
            title: "Stock",
            type: "number",
            validation: (Rule) => Rule.required().min(0),
        }),
    ],
    preview: {
        select: {
            title: "name",
            subtitle: "price",
            media: "images.0.asset", // <-- Correct path to image
        },
        prepare({ title, subtitle, media }) {
            return {
                title,
                subtitle: subtitle ? `$${subtitle}` : "No price",
                media,
            };
        },
    },


});