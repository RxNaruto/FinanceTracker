interface ButtonProps{
    label: string,
    onClick: (event: React.MouseEvent<HTMLButtonElement>)=>void;
}
export const Button=({label,onClick}:ButtonProps)=>{
    return <button
      onClick={onClick}
      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
    >
      {label}
    </button>
}
