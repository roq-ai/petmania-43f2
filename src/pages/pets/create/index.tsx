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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPet } from 'apiSdk/pets';
import { Error } from 'components/error';
import { petValidationSchema } from 'validationSchema/pets';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PetopiaInterface } from 'interfaces/petopia';
import { UserInterface } from 'interfaces/user';
import { getPetopias } from 'apiSdk/petopias';
import { getUsers } from 'apiSdk/users';
import { PetInterface } from 'interfaces/pet';

function PetCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PetInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPet(values);
      resetForm();
      router.push('/pets');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PetInterface>({
    initialValues: {
      name: '',
      health_record: '',
      pedigree: '',
      snack_count: 0,
      money_spent: 0,
      points: 0,
      petopia_id: (router.query.petopia_id as string) ?? null,
      owner_id: (router.query.owner_id as string) ?? null,
    },
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
            Create Pet
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'pet',
  operation: AccessOperationEnum.CREATE,
})(PetCreatePage);
