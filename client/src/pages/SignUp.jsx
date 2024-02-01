import { useForm, Controller } from "react-hook-form";
import style from "./style.module.scss";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "./validtionSchemas";
import Select from "../components/Select";
import Field from "../components/Field";
import Button from "../components/Button";

const defaultValues = {
  userName: "",
  password: "",
  role: 1,
};

const rolesList = [
  {
    id: 1,
    title: "Admin",
  },
  {
    id: 2,
    title: "Moderator",
  },
  {
    id: 3,
    title: "User",
  },
];

export default function SignUp() {
  const { handleSignUp } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(signUpSchema),
  });

  return (
    <form className={style.wrapper} onSubmit={handleSubmit(handleSignUp)}>
      <h2>Create account</h2>
      <Field
        name="userName"
        register={register}
        autoComplete="off"
        placeholder="Name user"
        error={Boolean(errors.userName)}
        helperText={errors.userName?.message}
      />
      <Field
        name="password"
        register={register}
        autoComplete="off"
        placeholder="Password"
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
      />
      <Controller
        control={control}
        name="role"
        render={({ field: { onChange, value } }) => (
          <Select onChange={onChange} value={value} options={rolesList} />
        )}
      />
      <Button disabled={isSubmitting} type="submit">
        Registration
      </Button>
    </form>
  );
}