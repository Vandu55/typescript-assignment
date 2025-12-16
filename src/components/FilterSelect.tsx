import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterSelectProps<T extends string | number> {
  label: string;
  value: T;
  options: readonly T[] | T[];
  onChange: (value: T) => void;
  formatOption?: (option: T) => string;
}

function FilterSelect<T extends string | number>({
  label,
  value,
  options,
  onChange,
  formatOption = (option) => String(option),
}: FilterSelectProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Select
        value={String(value)}
        onValueChange={(val) => {
          onChange(val as T);
        }}
      >
        <SelectTrigger className="w-full min-w-[160px] bg-card border-border hover:border-primary/50 transition-colors">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={String(option)} value={String(option)}>
              {formatOption(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default FilterSelect;
