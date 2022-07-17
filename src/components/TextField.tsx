import React, { InputHTMLAttributes } from 'react'

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  fullClassName?: string
  wrapperClassName?: string
  fullLabelClassName?: string
  label?: string
  labelClassName?: string
  fullWrapperClassName?: string
  error?: string
  errorClassName?: string
  fullErrorClassName?: string
  hint?: string
  hintClassName?: string
  fullHintClassName?: string
}

const TextField = (
  {
    wrapperClassName,
    fullWrapperClassName,
    fullClassName,
    label,
    fullLabelClassName,
    labelClassName,
    error,
    errorClassName,
    fullErrorClassName,
    hint,
    hintClassName,
    fullHintClassName,
    ...props
  }: TextFieldProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) => {
  return (
    <div className={fullWrapperClassName ?? `flex flex-col ${wrapperClassName ?? ''}`}>
      {label && (
        <label htmlFor={props.id} className={fullLabelClassName ?? `text-sm mb-0.5 ${labelClassName ?? ''}`}>
          Store nickname
        </label>
      )}
      <input
        {...props}
        className={
          fullClassName ??
          `py-1.5 px-2 bg-white rounded text-black focus:outline-none border border-slate-800 hover:border-blue-400 focus:border-blue-400 ${
            fullClassName ?? ''
          }`
        }
        ref={ref}
      />
      {error && <span className={fullErrorClassName ?? `block text-red-600 text-sm ${errorClassName}`}>{error}</span>}
      {!error && hint && (
        <span className={fullHintClassName ?? `block text-gray-400 text-sm ${hintClassName}`}>{hint}</span>
      )}
    </div>
  )
}

export default React.forwardRef(TextField)
