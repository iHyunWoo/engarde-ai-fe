import {Button} from "@/widgets/common/Button";
import {useState, useRef, useEffect} from "react";

export function Counter({ label, count, changeCount, onValueChange }: {
  label: string;
  count: number;
  changeCount: (delta: number) => void;
  onValueChange?: (value: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(count.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(count.toString());
  }, [count]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자만 입력 허용
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      if (onValueChange) {
        // onValueChange가 있으면 절대값으로 호출
        if (numValue !== count) {
          onValueChange(numValue);
        }
      } else {
        // 없으면 기존처럼 delta로 호출
        const delta = numValue - count;
        if (delta !== 0) {
          changeCount(delta);
        }
      }
    } else {
      setInputValue(count.toString());
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setInputValue(count.toString());
      setIsEditing(false);
    }
  };

  const handleDisplayClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-gray-500 text-sm text-center">{label}</p>
      <div className="flex items-center gap-2 justify-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => changeCount(-1)}>−</Button>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="text-xl font-semibold min-w-12 text-center border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            style={{ width: `${Math.max(inputValue.length, 2)}ch` }}
          />
        ) : (
          <p 
            className="text-xl font-semibold min-w-6 text-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
            onClick={handleDisplayClick}
          >
            {count}
          </p>
        )}
        <Button variant="outline" size="icon" onClick={() => changeCount(1)}>＋</Button>
      </div>
    </div>
  );
}