"use client";
/** Implements the tags widget component and its related interface behavior. */


const tags = [
  "Gaming",
  "Travel",
  "Food",
  "Sports",
  "Social",
  "Marketing",
  "Trip",
  "Makeup",
  "Technology",
  "Branding",
  "Beauty",
  "Printing",
  "Business",
  "Politics",
];

/** Renders the tags widget interface. */
export default function TagsWidget() {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="text-xl font-semibold mb-6">Tags</h3>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-4 py-2 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white cursor-pointer transition"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
