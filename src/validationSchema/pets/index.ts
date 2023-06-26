import * as yup from 'yup';

export const petValidationSchema = yup.object().shape({
  name: yup.string().required(),
  health_record: yup.string(),
  pedigree: yup.string(),
  snack_count: yup.number().integer(),
  money_spent: yup.number().integer(),
  points: yup.number().integer(),
  petopia_id: yup.string().nullable().required(),
  owner_id: yup.string().nullable().required(),
});
