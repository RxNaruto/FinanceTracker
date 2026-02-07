interface inputBox{
   label: string;
   placeholder: string;
   onChange: (event: React.ChangeEvent<HTMLInputElement>)=>void;
}

export const InputBox=({label,placeholder,onChange}: inputBox)=>{
       return <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <input
          placeholder={placeholder}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
       </div>
}
