import bcrypt from "bcrypt"
const saltRounds = 10;

export const hashedPassword = async(password: string)=>{
    try {
        const hashedPassword: string = await bcrypt.hash(password,saltRounds);
        return hashedPassword;
    } catch (e) {
        console.log(e);
        throw new Error("Password hashing failed");  

    }
}
export const comparePassword = async(password: string,hash:string)=>{
    try {
        const match = await bcrypt.compare(password,hash);
        return match;
    } catch (e) {
        console.log(e);
    }
}