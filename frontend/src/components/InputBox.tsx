interface inputBox{
   label: string;
   placeholder: string;
   onChange: (event: React.ChangeEvent<HTMLInputElement>)=>void;
}

export const InputBox=({label,placeholder,onChange}: inputBox)=>{
       return <div className="bg-gray-100">
        <div className="text-2xl font-medium">
            {label}
        </div>
        <input placeholder={placeholder} onChange={onChange} className="w-96 h-10 rounded-sm " />
       </div>
}