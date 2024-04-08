import Toast from "@/components/Toast";
import { login, register } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useSessionStorage } from "@/hooks/useStorage";

type useAuthMutationProps = {
    action: "REGISTER" | "LOGIN";
}
const useAuthMutation = ({ action }: useAuthMutationProps) => {
    const [session, setSession] = useSessionStorage('user', '');
    const { mutate, ...rest } = useMutation({
        mutationFn: async (user: any) => {
            switch (action) {
                case "REGISTER":
                    return await register({
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        confirmPassword: user.confirmPassword,
                        avatar: user.avatar,
                    });
                case "LOGIN":
                    return await login({
                        email: user.email,
                        password: user.password
                    });
                default:
                    return null;
            }
        },
        onSuccess: async (data: any) => {
            setSession(data.user);
            console.log("Success data:", data);
            Toast({ type: "success", report: data.message });
        },
        onError: (error: any) => {
            console.log(error);
            console.log(error.response.data.message);
            const message = error.response.data.message;
            console.log(message);
            message.map((value:string) => {
                Toast({type:"error",report:value})
            })  
        }
    });

    return { mutate, session, ...rest }; 
};

export default useAuthMutation;