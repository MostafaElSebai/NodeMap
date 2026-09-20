import { useState } from 'react'
import { Combobox } from '@headlessui/react'

export default function CustomCombobox({ items, selectedItem, onChange, placeholder = "Search..." }) {
  const [query, setQuery] = useState('')

  const filteredItems =
    query === ''
      ? items
      : items.filter((item) => {
          const matchLabel = item.label.toLowerCase().includes(query.toLowerCase());
          const matchSub = item.subLabel ? item.subLabel.toLowerCase().includes(query.toLowerCase()) : false;
          return matchLabel || matchSub;
        })

  return (
    <Combobox value={selectedItem} onChange={onChange} nullable>
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded bg-bg-app border border-border-subtle focus-within:border-accent-teal transition-colors text-left text-sm text-text-primary">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 bg-transparent text-text-primary focus:ring-0 focus:outline-none"
            displayValue={(item) => item?.label}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </Combobox.Button>
        </div>
        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-bg-surface border border-border-subtle py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50 custom-scrollbar">
          {filteredItems.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none py-2 px-4 text-text-secondary">
              Nothing found.
            </div>
          ) : (
            filteredItems.map((item) => (
              <Combobox.Option
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
                    <div className="flex flex-col">
                        <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                          {item.label}
                        </span>
                        {item.subLabel && (
                            <span className={`block text-[10px] truncate ${active ? 'text-bg-app/80' : 'text-text-secondary'}`}>
                                {item.subLabel}
                            </span>
                        )}
                    </div>
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
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}
