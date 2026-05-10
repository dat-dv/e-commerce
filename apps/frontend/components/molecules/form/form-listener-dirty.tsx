import { useFormContext, useFormState } from 'react-hook-form';

const FormListenerDirty = ({ children }: { children: (isDirty: boolean) => React.ReactNode }) => {
  const { control } = useFormContext();
  const { isDirty } = useFormState({ control });

  return <div>{children(isDirty)}</div>;
};

export default FormListenerDirty;
