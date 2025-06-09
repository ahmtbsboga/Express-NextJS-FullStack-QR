import Image from "next/image";
import { FC } from "react";
import Password from "./passwordToggle";
import FormButton from "./formButton";

const Login: FC = () => {
  return (
    <div className="mt-40 flex flex-col gap-5 items-center justify-center text-black text-5xl shadow-2xl shadow-sky-500 rounded-xl p-20">
      <div className="p-6 shadow-2xl shadow-gray-600 rounded-lg">
        <div className="flex gap-20 flex-row-reverse items-center relative">
          <h1 className="font-bold text-2xl mb-5">
            KOCA-REİS <br /> Yönetici Girişi
          </h1>
          <Image
            src="/logincapa.jpg"
            alt="login"
            width={100}
            height={100}
            quality={100}
            className="rounded-full absolute right-[190px] bottom-0"
          />
        </div>

        <form className="flex flex-col items-center gap-4">
          <input
            type="text"
            className="p-2 bg-zinc-200 text-black text-lg rounded-xl outline-none"
            placeholder="Kullanıcı adı"
          />

          <Password />

          <FormButton />
        </form>
      </div>
    </div>
  );
};

export default Login;
