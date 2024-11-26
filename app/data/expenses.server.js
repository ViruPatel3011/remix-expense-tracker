import { prisma } from "./database.server"

export async function addExpense(expenseData, userId) {
    try {
        return await prisma.expense.create({
            data: {
                title: expenseData.title,
                amount: +expenseData.amount,
                date: new Date(expenseData.date),
                User: {
                    connect: { id: userId }
                }
            }
        });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getExpenses(userId) {
    if (!userId) {
        throw new Error('failed to get expenses');
    }
    try {
        return await prisma.expense.findMany(
            {
                where: { userId: userId },
                orderBy: { date: 'desc' }
            }
        )
    } catch (error) {
        console.log(error);
        throw new Error('failed to get expenses');
    }
}

export async function getExpense(id) {
    try {
        return await prisma.expense.findFirst({ where: { id: id } });
    } catch (error) {
        console.log(error);
        throw new Error('failed to get expense');
    }
}

export async function updateExpense(id, updatedData) {
    try {
        await prisma.expense.update({
            where: { id: id },
            data: {
                title: updatedData.title,
                amount: +updatedData.amount,
                date: new Date(updatedData.date),
            }
        })
    }
    catch (error) {
        console.log(error);
        throw new Error('failed to update expense');
    }
}

export async function deleteExpense(id) {
    try {
        await prisma.expense.delete({
            where: { id: id }
        })

    } catch (error) {
        console.log(error);
        throw new Error('failed to delete expense');
    }
}