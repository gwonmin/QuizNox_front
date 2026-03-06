import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useRegister } from "../../hooks/queries/useAuthQueries";

export interface RegisterFormState {
  username: string;
  password: string;
  passwordConfirm: string;
}

const initialForm: RegisterFormState = {
  username: "",
  password: "",
  passwordConfirm: "",
};

function validateRegisterForm(form: RegisterFormState): string | null {
  if (!form.username || !form.password || !form.passwordConfirm) {
    return "모든 필드를 입력해주세요.";
  }
  if (form.username.length < 3 || form.username.length > 20) {
    return "사용자명은 3-20자 사이여야 합니다.";
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(form.username)) {
    return "사용자명은 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.";
  }
  if (form.password.length < 4) {
    return "비밀번호는 4자 이상이어야 합니다.";
  }
  if (form.password !== form.passwordConfirm) {
    return "비밀번호가 일치하지 않습니다.";
  }
  return null;
}

export function useRegisterForm() {
  const navigate = useNavigate();
  const { isAuthenticated, clearError } = useAuthStore();
  const { mutate: register, isPending: loading, error } = useRegister();

  const [formData, setFormData] = useState<RegisterFormState>(initialForm);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => () => clearError(), [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
  };

  const validate = (): boolean => {
    const msg = validateRegisterForm(formData);
    if (msg) {
      setValidationError(msg);
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    register(
      { username: formData.username, password: formData.password },
      { onSuccess: () => navigate("/") }
    );
  };

  const displayError = error?.message ?? validationError;

  return {
    formData,
    loading,
    displayError,
    handleChange,
    handleSubmit,
  };
}
