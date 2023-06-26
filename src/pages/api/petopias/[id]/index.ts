import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { petopiaValidationSchema } from 'validationSchema/petopias';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.petopia
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPetopiaById();
    case 'PUT':
      return updatePetopiaById();
    case 'DELETE':
      return deletePetopiaById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPetopiaById() {
    const data = await prisma.petopia.findFirst(convertQueryToPrismaUtil(req.query, 'petopia'));
    return res.status(200).json(data);
  }

  async function updatePetopiaById() {
    await petopiaValidationSchema.validate(req.body);
    const data = await prisma.petopia.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    if (req.body.name) {
      await roqClient.asUser(roqUserId).updateTenant({ id: user.tenantId, tenant: { name: req.body.name } });
    }
    return res.status(200).json(data);
  }
  async function deletePetopiaById() {
    const data = await prisma.petopia.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
