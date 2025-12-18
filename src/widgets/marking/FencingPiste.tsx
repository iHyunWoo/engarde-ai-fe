'use client';

import {Dispatch, SetStateAction, useState} from 'react';
import {Button} from '@/widgets/common/Button';
import {ArrowLeftRight} from 'lucide-react';

interface FencingPisteProps {
  value: number; // 1-6 사이의 값
  onChange?: (value: number) => void;
  readOnly?: boolean;
  disabled?: boolean;
  showDirectionToggle?: boolean;
  className?: string;
  isLeftPosition: boolean;
  setIsLeftPosition: Dispatch<SetStateAction<boolean>>;
}

export function FencingPiste({
  value,
  isLeftPosition,
  setIsLeftPosition,
  onChange,
  readOnly = false,
  disabled = false,
  showDirectionToggle = true,
  className = '',
}: FencingPisteProps) {
  // Disabled zone인지 확인 (양 끝 - 0, 7)
  const isDisabledZone = (position: number): boolean => {
    return position === 0 || position === 7;
  };

  // Warning zone인지 확인 (1번과 6번)
  const isWarningZone = (position: number): boolean => {
    return position === 1 || position === 6;
  };

  // 피스트 위치 선택 핸들러
  const handlePisteLocationSelect = (position: number) => {
    if (readOnly || disabled || isDisabledZone(position)) return;
    
    // 1-6만 선택 가능
    // My가 왼쪽일 때: 1,2,3,4,5,6 (위치 1,2,3,4,5,6)
    // My가 오른쪽일 때: 6,5,4,3,2,1 (위치 1,2,3,4,5,6)
    if (isLeftPosition) {
      onChange?.(position);
    } else {
      // 오른쪽에서 왼쪽으로 매핑: 1->6, 2->5, 3->4, 4->3, 5->2, 6->1
      onChange?.(7 - position);
    }
  };

  // 방향 전환 핸들러
  const handleToggleDirection = () => {
    if (readOnly || disabled) return;
    // isSelected 로직이 방향에 따라 자동으로 올바른 위치를 표시함
    setIsLeftPosition(!isLeftPosition);
  };

  // 선택된 위치인지 확인
  const isSelected = (position: number): boolean => {
    // Disabled zone (0, 7)은 선택 불가
    if (isDisabledZone(position)) return false;
    // 1-6번만 선택 가능
    if (isLeftPosition) {
      return value === position;
    } else {
      return value === (7 - position);
    }
  };

  // En-garde 라인 위치인지 확인 (위치 1과 6)
  const isEnGardeLine = (position: number): boolean => {
    return position === 1 || position === 6;
  };

  // 중앙선 위치인지 확인 (위치 4)
  const isCenterLine = (position: number): boolean => {
    return position === 4;
  };

  // 각 칸의 비율 (2 - 2 - 3 - 2 - 2 - 3 - 2 - 2)
  const getPositionWidth = (position: number): string => {
    const ratios = [2, 2, 3, 2, 2, 3, 2, 2];
    const total = ratios.reduce((sum, r) => sum + r, 0);
    const percentage = (ratios[position] / total) * 100;
    return `${percentage}%`;
  };

  // 구분선이 필요한 위치인지 확인 (각 칸 사이)
  const needsDivider = (position: number): boolean => {
    return position < 7; // 마지막 칸 제외
  };

  // 가운데 구분선인지 확인 (position 3과 4 사이)
  const isCenterDivider = (position: number): boolean => {
    return position === 3;
  };

  const isInteractive = !readOnly && !disabled;

  return (
    <div className={`space-y-2 ${className}`}>
      {showDirectionToggle && !readOnly && (
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleToggleDirection}
            disabled={disabled}
            className="h-7 px-2"
          >
            <ArrowLeftRight className="size-3" />
          </Button>
        </div>
      )}
      
      {/* 펜싱 피스트 */}
      <div className="relative">
        {/* My/Opponent 라벨 */}
        <div className="flex justify-between mb-1">
          <div className="text-xs font-medium text-gray-600">
            {isLeftPosition ? 'My' : 'Opponent'}
          </div>
          <div className="text-xs font-medium text-gray-600">
            {isLeftPosition ? 'Opponent' : 'My'}
          </div>
        </div>
        
        {/* 피스트 본체 */}
        <div className="relative w-full h-16 bg-white border-2 border-gray-800 rounded-sm overflow-hidden">
          {/* 8칸 구분선 및 클릭 영역 */}
          <div className="absolute inset-0 flex">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((position) => {
              const selected = isSelected(position);
              const disabledZone = isDisabledZone(position);
              const warningZone = isWarningZone(position);
              const needsDiv = needsDivider(position);
              const isCenterDiv = isCenterDivider(position);
              
              return (
                <div
                  key={position}
                  className="relative h-full"
                  style={{ width: getPositionWidth(position) }}
                >
                  {/* 클릭 가능한 영역 (1-6번만, disabled zone 제외) */}
                  {!disabledZone && isInteractive && (
                    <button
                      type="button"
                      onClick={() => handlePisteLocationSelect(position)}
                      disabled={disabled}
                      className={`
                        absolute inset-0 w-full h-full transition-all
                        ${selected
                          ? 'bg-primary/30  z-10'
                          : 'hover:bg-primary/10 '
                        }
                        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                      `}
                    />
                  )}
                  
                  {/* Read-only 모드에서 선택된 위치 표시 */}
                  {!disabledZone && readOnly && selected && (
                    <div className="absolute inset-0 bg-primary/20 border-2 border-primary/50 z-10" />
                  )}
                  
                  {/* Warning Zone 패턴 (1번과 6번) - 선택 가능 */}
                  {warningZone && (
                    <div 
                      className="absolute inset-0 bg-gray-100 z-0 pointer-events-none"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 8px)'
                      }}
                    />
                  )}
                  
                  {/* Disabled Zone (양 끝 - 0, 7) - 선택 불가 */}
                  {disabledZone && (
                    <div className="absolute inset-0 bg-gray-200 border-2 border-dashed border-gray-400 cursor-not-allowed z-0" />
                  )}

                  
                  {/* 구분선 (각 칸 사이) */}
                  {needsDiv && (
                    <div 
                      className={`absolute top-0 bottom-0 right-0 w-0.5 bg-gray-400 z-20 ${
                        isCenterDiv ? 'h-1/2 top-1/4' : ''
                      }`}
                    />
                  )}
                  
                  {/* 선택 표시 (1-6번만, disabled zone 제외, warning zone 포함) */}
                  {selected && !disabledZone && (
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      <div className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-lg" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

