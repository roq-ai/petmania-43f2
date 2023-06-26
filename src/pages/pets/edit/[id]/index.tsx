import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getPetById, updatePetById } from 'apiSdk/pets';
import { Error } from 'components/error';
import { petValidationSchema } from 'validationSchema/pets';
import { PetInterface } from 'interfaces/pet';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PetopiaInterface } from 'interfaces/petopia';
import { UserInterface } from 'interfaces/user';
import { getPetopias } from 'apiSdk/petopias';
import { getUsers } from 'apiSdk/users';

function PetEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PetInterface>(
    () => (id ? `/pets/${id}` : null),
    () => getPetById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PetInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePetById(id, values);
      mutate(updated);
      resetForm();
      router.push('/pets');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PetInterface>({
    initialValues: data,
    validationSchema: petValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Pet
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="health_record" mb="4" isInvalid={!!formik.errors?.health_record}>
              <FormLabel>Health Record</FormLabel>
              <Input
                type="text"
                name="health_record"
                value={formik.values?.health_record}
                onChange={formik.handleChange}
              />
              {formik.errors.health_record && <FormErrorMessage>{formik.errors?.health_record}</FormErrorMessage>}
            </FormControl>
            <FormControl id="pedigree" mb="4" isInvalid={!!formik.errors?.pedigree}>
              <FormLabel>Pedigree</FormLabel>
              <Input type="text" name="pedigree" value={formik.values?.pedigree} onChange={formik.handleChange} />
              {formik.errors.pedigree && <FormErrorMessage>{formik.errors?.pedigree}</FormErrorMessage>}
            </FormControl>
            <FormControl id="snack_count" mb="4" isInvalid={!!formik.errors?.snack_count}>
              <FormLabel>Snack Count</FormLabel>
              <NumberInput
                name="snack_count"
                value={formik.values?.snack_count}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('snack_count', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.snack_count && <FormErrorMessage>{formik.errors?.snack_count}</FormErrorMessage>}
            </FormControl>
            <FormControl id="money_spent" mb="4" isInvalid={!!formik.errors?.money_spent}>
              <FormLabel>Money Spent</FormLabel>
              <NumberInput
                name="money_spent"
                value={formik.values?.money_spent}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('money_spent', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.money_spent && <FormErrorMessage>{formik.errors?.money_spent}</FormErrorMessage>}
            </FormControl>
            <FormControl id="points" mb="4" isInvalid={!!formik.errors?.points}>
              <FormLabel>Points</FormLabel>
              <NumberInput
                name="points"
                value={formik.values?.points}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('points', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.points && <FormErrorMessage>{formik.errors?.points}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<PetopiaInterface>
              formik={formik}
              name={'petopia_id'}
              label={'Select Petopia'}
              placeholder={'Select Petopia'}
              fetcher={getPetopias}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'owner_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'pet',
  operation: AccessOperationEnum.UPDATE,
})(PetEditPage);
