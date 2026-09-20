import { Listbox } from '@headlessui/react'

export default function CustomSelect({ items, selectedItem, onChange, placeholder = "Select...", className = "", name }) {
  return (
    <Listbox value={selectedItem} onChange={onChange} name={name}>
      <div className={`relative mt-1 ${className}`}>
        <Listbox.Button className="relative w-full cursor-default rounded bg-bg-app border border-border-subtle py-2 pl-3 pr-10 text-left text-sm text-text-primary focus:outline-none focus:border-accent-teal transition-colors">
          <span className={`block truncate ${selectedItem ? 'text-text-primary' : 'text-text-secondary'}`}>
            {selectedItem ? selectedItem.label : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-bg-surface border border-border-subtle py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50 custom-scrollbar">
          {items.map((item) => (
            <Listbox.Option
              key={item.id}
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                  active ? 'bg-accent-teal text-bg-app font-bold' : 'text-text-primary'
                }`
              }
              value={item}
            >
              {({ selected, active }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? 'font-bold' : 'font-normal'
                    }`}
                  >
                    {item.label}
                  </span>
                  {selected ? (
                    <span
                      className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                        active ? 'text-bg-app' : 'text-accent-teal'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}
