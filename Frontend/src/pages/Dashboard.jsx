// src/pages/Dashboard.jsx

import { useEffect, useState } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import AddExpenseModal from "../components/AddExpenseModal"
import AddIncomeModal from "../components/AddIncomeModal"
import DashboardCharts from "../components/Dashboardcharts"

function Dashboard() {
  const [data, setData] =
    useState(null)

  const [expenses, setExpenses] =
    useState([])

  const [
    showExpenseModal,
    setShowExpenseModal
  ] = useState(false)

  const [
    showIncomeModal,
    setShowIncomeModal
  ] = useState(false)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard =
    async () => {
      try {
        const [
          dashRes,
          expenseRes,
          groupRes
        ] =
          await Promise.all([
            api.get(
              "/api/dashboard"
            ),
            api.get(
              "/api/expense"
            ),
            api.get(
              "/api/group/info"
            )
          ])

        const groups = [
          ...(
            groupRes.data
              ?.created || []
          ),
          ...(
            groupRes.data
              ?.joined || []
          )
        ]

        const uniqueGroups =
          groups.filter(
            (
              group,
              index,
              self
            ) =>
              index ===
              self.findIndex(
                (g) =>
                  g._id ===
                  group._id
              )
          )

        let groupTotal = 0

        for (const group of uniqueGroups) {
          try {
            const res =
              await api.get(
                `/api/group/${group._id}/expenses`
              )

            const total =
              res.data.reduce(
                (
                  sum,
                  item
                ) =>
                  sum +
                  Number(
                    item.amount ||
                      0
                  ),
                0
              )

            groupTotal +=
              total
          } catch (
            err
          ) {
            console.log(
              err
            )
          }
        }

        setData({
          ...dashRes.data,
          groupExpense:
            groupTotal
        })

        setExpenses(
          expenseRes.data
        )
      } catch (err) {
        console.log(err)
      }
    }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xl font-semibold text-slate-700">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />

     <div className="max-w-[1600px] mx-auto px-4 md:px-32 lg:px-36 py-8">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
          Dashboard
        </h1>

        <p className="text-slate-500 text-lg mb-10">
          Welcome back 👋
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">

          <button
            onClick={() =>
              setShowIncomeModal(
                true
              )
            }
            className="w-full sm:w-auto  px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:opacity-90 transition cursor-pointer"
          >
            + Add Income
          </button>

          <button
            onClick={() =>
              setShowExpenseModal(
                true
              )
            }
            className=" w-full sm:w-auto  px-6 py-3 rounded-2xl border border-slate-300 bg-white text-slate-800 font-semibold hover:bg-slate-100 transition cursor-pointer"
          >
            + Add Expense
          </button>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">

          {/* Remaining Balance */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 hover:shadow-lg transition">

            <h2 className="text-cyan-600 text-lg font-semibold mb-3">
              Remaining Balance
            </h2>

            <p className="text-4xl font-bold text-slate-900">
              ₹ {data.remaining}
            </p>

            <p className="text-sm text-slate-500 mt-3">
              Available Balance
            </p>

          </div>

          {/* Income */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 hover:shadow-lg transition">

            <h2 className="text-green-600 text-lg font-semibold mb-3">
              Total Income
            </h2>

            <p className="text-4xl font-bold text-slate-900">
              ₹ {data.totalIncome}
            </p>

            <p className="text-sm text-slate-500 mt-3">
              All Time Income
            </p>

          </div>

          {/* Expense */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 hover:shadow-lg transition">

            <h2 className="text-red-500 text-lg font-semibold mb-3">
              Total Expense
            </h2>

            <p className="text-4xl font-bold text-slate-900">
              ₹ {data.totalExpense}
            </p>

            <p className="text-sm text-slate-500 mt-3">
              All Time Expense
            </p>

          </div>

        </div>

        {/* Charts */}
        <DashboardCharts
          expenses={expenses}
          totalExpense={
            data.totalExpense
          }
          groupExpense={
            data.groupExpense ||
            0
          }
        />

      </div>

      {/* Add Expense */}
      {showExpenseModal && (
        <AddExpenseModal
          closeModal={() =>
            setShowExpenseModal(
              false
            )
          }
          refreshData={
            fetchDashboard
          }
        />
      )}

      {/* Add Income */}
      {showIncomeModal && (
        <AddIncomeModal
          closeModal={() =>
            setShowIncomeModal(
              false
            )
          }
          refreshData={
            fetchDashboard
          }
        />
      )}

    </div>
  )
}

export default Dashboard