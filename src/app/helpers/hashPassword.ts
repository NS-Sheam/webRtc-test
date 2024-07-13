import bcrypt from 'bcrypt';

export const hashedPassword = async (password: string, saltRounds:string): Promise<string> => {
    try {
        const hashedPassword: string = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
}