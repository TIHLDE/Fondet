import React from 'react';
import {Checkbox} from "@/components/ui/checkbox";

export default function MultiCheckbox({
    label,
    options,
    selected,
    onChange,
    error,
}: {
    label?: string;
    options: string[];
    selected: string[];
    onChange: (newVal: string[]) => void;
    error?: string;
}) {
    const toggle = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter((s) => s !== option));
        }
        else onChange([...selected, option]);
    };

    return (
        <fieldset>
            <legend className="font-medium text-foreground-primary">{label}</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {options.map((opt) => (
                    <label key={opt} className="flex items-center space-x-2">
                        <Checkbox
                            checked={selected.includes(opt)} onChange={() => toggle(opt)}
                            onCheckedChange={() => toggle(opt)}
                        />
                        <span className="text-foreground-secondary">{opt}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-sm text-red-600 mt-1 text-foreground-primary">{error}</p>}
        </fieldset>
    );
}