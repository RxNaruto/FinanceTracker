interface ButtonProps{
    label: string,
    onClick: (event: React.MouseEvent<HTMLButtonElement>)=>void;
}
export const Button=({label,onClick}:ButtonProps)=>{
    return <div className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-none transition-colors flex justify-center">
        <button  onClick={onClick}>{label}  </button>
    </div>
}