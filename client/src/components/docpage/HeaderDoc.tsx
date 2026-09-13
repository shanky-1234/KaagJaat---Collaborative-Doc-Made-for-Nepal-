
import LanguageSwitcher from '../dashboard/LanguageSwitcher'
import logo from '../../assets/logo-icon.svg'
import Profile from '#components/shared/Profie'
import { Button } from '#components/ui/button'
import { ArrowLeft, ChevronLeft, CloudAlert, CloudCheck, CloudOff, CloudUpload, Lock, LockIcon, MessageSquare, Share2 } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useCallback, useRef, useState } from 'react'
import { getNepaliSuggestions } from '@/services/transliterator'

interface DocumentHeaderProps {
    title?:string | undefined,
    onTitleChange?:(title:string)=>void
    savingState?:string
}

const DEVANAGARI_DIGITS: Record<string, string> = {
  '0': '०',
  '1': '१',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९',
};

const DEVANAGARI_SYMBOLS: Record<string, string> = {
  '.': '।',
  ',': ',',
  ':': ':',
  ';': ';',
  '?': '?',
  '!': '!',
  '+': '+',
  '-': '-',
  '/': '/',
  '=': '=',
  '(': '(',
  ')': ')',
  '[': '[',
  ']': ']',
  '{': '{',
  '}': '}',
  '@': '@',
  '#': '#',
  '$': '$',
  '%': '%',
  '&': '&',
  '*': '*',
  '_': '_',
  '<': '<',
  '>': '>',
  '|': '|',
  '~': '~',
  '`': '`',
  '\\': '\\',
};

function getMappedSuggestions(word: string): string[] {
  if (!word) return [];

  if (/^[0-9]+$/.test(word)) {
    return [Array.from(word, (char) => DEVANAGARI_DIGITS[char] ?? char).join('')];
  }

  if (/^[0-9\p{P}\p{S}]+$/u.test(word)) {
    return [
      Array.from(word, (char) => DEVANAGARI_SYMBOLS[char] ?? char).join(''),
    ];
  }

  return [];
}

function HeaderDocPage({title,onTitleChange,savingState}:DocumentHeaderProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const latestRequestId = useRef(0)
  const debounceTimer = useRef<number | null>(null)

  const closeSuggestions = useCallback(() => {
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current)
      debounceTimer.current = null
    }
    latestRequestId.current += 1
    setSuggestions([])
    setActiveIndex(0)
  }, [])

  const getCurrentToken = useCallback((value: string, caret: number) => {
    const beforeCaret = value.slice(0, caret)
    const match = beforeCaret.match(/([^\s]+)$/)

    if (!match) {
      return { token: '', start: caret, end: caret }
    }

    const token = match[1]
    return {
      token,
      start: caret - token.length,
      end: caret,
    }
  }, [])

  const applySuggestion = useCallback((suggestion: string, addSpaceAfter = false) => {
    const input = inputRef.current
    if (!input || !title) return

    const caret = input.selectionStart ?? title.length
    const { start, end } = getCurrentToken(title, caret)
    const nextValue = title.slice(0, start) + suggestion + (addSpaceAfter ? ' ' : '') + title.slice(end)
    const nextCaret = start + suggestion.length + (addSpaceAfter ? 1 : 0)

    onTitleChange?.(nextValue)
    closeSuggestions()

    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(nextCaret, nextCaret)
    })
  }, [closeSuggestions, getCurrentToken, onTitleChange, title])

  const updateSuggestions = useCallback((value: string, caret: number) => {
    const { token } = getCurrentToken(value, caret)

    if (!token) {
      closeSuggestions()
      return
    }

    if (/^[\u0900-\u097F]+$/.test(token)) {
      closeSuggestions()
      return
    }

    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current)
    }

    const requestId = ++latestRequestId.current

    debounceTimer.current = window.setTimeout(() => {
      const mapped = getMappedSuggestions(token)
      if (requestId !== latestRequestId.current) return

      if (mapped.length) {
        setSuggestions(mapped)
        setActiveIndex(0)
        return
      }

      getNepaliSuggestions(token).then((suggestionList) => {
        if (requestId !== latestRequestId.current) return
        setSuggestions(suggestionList || [])
        setActiveIndex(0)
      })
    }, 150)
  }, [closeSuggestions, getCurrentToken])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value
    onTitleChange?.(nextValue)

    const caret = e.target.selectionStart ?? nextValue.length
    updateSuggestions(nextValue, caret)
  }, [onTitleChange, updateSuggestions])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return

    if (e.key === 'Escape') {
      e.preventDefault()
      closeSuggestions()
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, 0))
      return
    }

    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault()
      const activeSuggestion = suggestions[activeIndex] ?? suggestions[0]
      if (activeSuggestion) {
        applySuggestion(activeSuggestion, true)
      }
    }
  }, [activeIndex, applySuggestion, closeSuggestions, suggestions])

  return (
    <header className='pt-6 pr-8 pb-3  border-neutral-three flex justify-between items-center w-full border-b-1'>
            <div className='px-7 flex items-center gap-4'>
            
             <Button size={'icon'} className='w-10 h-10 cursor-pointer' onClick={()=>navigate('/')}>
                <ChevronLeft className='w-full h-full'/>
             </Button>

             <div className='w-auto relative'>
              <input
                ref={inputRef}
                value={title ?? ''}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onClick={(e) => {
                  const caret = e.currentTarget.selectionStart ?? title?.length ?? 0
                  updateSuggestions(title ?? '', caret)
                }}
                onSelect={(e) => {
                  const caret = e.currentTarget.selectionStart ?? title?.length ?? 0
                  updateSuggestions(title ?? '', caret)
                }}
                className='text-xl w-auto min-w-20 font-main font-medium text-black outline-none'
                size={Math.max((title ?? '').length, 1)}
                required={true}
              />

              {suggestions.length > 0 && (
                <div className='absolute top-full left-0 z-50 mt-2 max-w-40 rounded-lg border border-neutral-300 bg-white shadow-md overflow-hidden'>
                  {suggestions.map((word, index) => (
                    <div
                      key={`${word}-${index}`}
                      onMouseDown={(event) => {
                        event.preventDefault()
                        applySuggestion(word)
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`${index === activeIndex ? 'bg-primary/20' : ''} cursor-pointer space-x-2 px-2 py-1`}
                    >
                      <span className='font-main text-sm'>{index + 1}.</span>
                      <span className='font-main text-sm'>{word}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Button variant={'ghost'} className='hover:bg-gray-100 group transition duration-300 rounded-full'>
                <LockIcon color={'#4B4B4B'}/>
                <div className='group-hover:block hidden transition duration-300'>
                  Locked
                </div>
              </Button>
            </div>
            <div>
              <span className='text-neutral-500 flex items-center gap-2 flex-row-reverse'>
                {
                  savingState == 'saving' ? 
                  <CloudUpload size={20}/> : 
                  savingState == 'saved' ? 
                  <CloudCheck size={20}/> :
                  savingState == 'unsaved' ? 
                  <CloudOff size={20}/>:
                  <CloudAlert size={20}/>
                }
                {savingState}</span>
            </div>
            </div>
           
       
       <div className='flex items-center flex-row-reverse gap-8'>
        <Profile/>
        <div className='flex flex-row gap-2'>
           <Button variant={'default'} className='bg-primary text-white rounded-full'><MessageSquare/></Button>
        <Button variant={'default'} className='bg-primary text-white'><Share2/>Share</Button>
       
       </div>
       </div>
    </header>
  )
}

export default HeaderDocPage