import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useLogin } from "../../hooks/queries/useAuthQueries";

export interface LoginFormState {
  username: string;
  password: string;
}

const initialForm: LoginFormState = { username: "", password: "" };

function validateLoginForm(form: LoginFormState): string | null {
  if (!form.username || !form.password) {
    return "사용자명과 비밀번호를 입력해주세요.";
  }
  if (form.username.length < 3 || form.username.length > 20) {
    return "사용자명은 3-20자 사이여야 합니다.";
  }
  if (form.password.length < 4) {
    return "비밀번호는 4자 이상이어야 합니다.";
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(form.username)) {
    return "사용자명은 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.";
  }
  return null;
}

export function useLoginForm() {
  const navigate = useNavigate();
  const { isAuthenticated, clearError } = useAuthStore();
  const { mutate: login, isPending: loading, error } = useLogin();

  const [formData, setFormData] = useState<LoginFormState>(initialForm);
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
    const msg = validateLoginForm(formData);
    if (msg) {
      setValidationError(msg);
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    login(formData, { onSuccess: () => navigate("/") });
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
