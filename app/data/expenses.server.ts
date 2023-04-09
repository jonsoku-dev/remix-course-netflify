import type { Expense } from "@prisma/client";
import { prisma } from "~/data/database.server";

export async function addExpense(expenseData: any, userId: string) {
  try {
    return await prisma.expense.create({
      data: {
        title: expenseData.title,
        amount: +expenseData.amount,
        date: new Date(expenseData.date),
        User: { connect: { id: userId } },
      },
    });
  } catch (error) {
    throw new Error("Failed to add expense.");
  }
}

export async function getExpenses(userId: string) {
  if (!userId) {
    throw new Error("Failed to get expenses.");
  }
  try {
    const result = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    return result;
  } catch (err) {
    throw err;
  }
}

export async function getExpense(id: string) {
  try {
    const result = await prisma.expense.findUnique({ where: { id } });
    return result;
  } catch (err) {
    throw err;
  }
}

export async function updateExpense(id: string, expense: any) {
  try {
    const result = await prisma.expense.update({
      where: { id },
      data: {
        ...expense,
        amount: +expense.amount,
        date: new Date(expense.date),
      },
    });
    return result;
  } catch (err) {
    throw err;
  }
}

export async function deleteExpense(id: string) {
  try {
    const result = await prisma.expense.delete({ where: { id } });
    return result;
  } catch (err) {
    throw new Error("Failed to delete expense");
  }
}
