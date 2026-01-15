import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MultiSelectProps {
  label?: string;
  error?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  required?: boolean;
}

const AVAILABLE_CATEGORIES = [
  'Direção Defensiva',
  'Baliza',
  'Estacionamento',
  'Direção Urbana',
  'Direção em Rodovia',
  'Habilitação A',
  'Habilitação B',
  'Reciclagem',
  'Primeira Habilitação',
];

export function MultiSelect({
  label,
  error,
  value,
  onChange,
  placeholder = 'Digite para adicionar categorias',
  required,
}: MultiSelectProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = AVAILABLE_CATEGORIES.filter(
    (cat) =>
      !value.includes(cat) &&
      cat.toLowerCase().includes(inputValue.toLowerCase())
  );

  const addCategory = (category: string) => {
    if (!value.includes(category)) {
      onChange([...value, category]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeCategory = (category: string) => {
    onChange(value.filter((c) => c !== category));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addCategory(inputValue.trim());
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="label-base">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={cn(
            'input-base min-h-[42px] h-auto flex flex-wrap gap-2 p-2',
            error && 'input-error'
          )}
        >
          {value.map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-800 rounded-md text-sm"
            >
              {category}
              <button
                type="button"
                onClick={() => removeCategory(category)}
                className="hover:bg-primary-200 rounded p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] outline-none border-none p-0 focus:ring-0"
          />
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => addCategory(category)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      
      {!error && value.length === 0 && (
        <p className="mt-1.5 text-sm text-gray-500">
          Selecione as categorias ou digite para adicionar novas
        </p>
      )}
    </div>
  );
}
