// src/components/DashboardCharts.jsx

import {
  PieChart,
  Pie,
  Cell
} from "recharts"

function DashboardCharts({
  expenses,
  totalExpense = 0,
  groupExpense = 0
}) {
  const categoryMap = {}

  expenses.forEach((item) => {
    const category =
      item.category || "Other"

    categoryMap[category] =
      (categoryMap[
        category
      ] || 0) +
      Number(
        item.amount || 0
      )
  })

  const colors = {
    Food: "#06B6D4",
    Travel: "#10B981",
    Shopping: "#F97316",
    Bills: "#2563EB",
    Health: "#EC4899",
    Other: "#64748B"
  }

  const categoryData =
    Object.keys(categoryMap).map(
      (key) => ({
        name: key,
        amount:
          categoryMap[key],
        color:
          colors[key] ||
          "#64748B"
      })
    )

  const maxAmount =
    Math.max(
      ...categoryData.map(
        (item) =>
          item.amount
      ),
      1
    )

  const personalExpense =
    Number(
      totalExpense || 0
    )

  const finalGroupExpense =
    Number(
      groupExpense || 0
    )

  const splitData = [
    {
      name: "Personal",
      value:
        personalExpense,
      color:
        "#06B6D4"
    },
    {
      name: "Group",
      value:
        finalGroupExpense,
      color:
        "#2563EB"
    }
  ]

  const grandTotal =
    personalExpense +
    finalGroupExpense

  return (
    <div className="overflow-x-auto"> 
<div className="grid grid-cols-1 md:grid-cols-3 gap-7 mt-10">
      {/* Left Card */}
      <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-8 hover:shadow-lg transition">

        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8">
          Spending by Category
        </h2>

        <div className="space-y-6">

          {categoryData.length >
          0 ? (
            categoryData.map(
              (item) => (
                <div
                  key={
                    item.name
                  }
                >

                  <div className="flex justify-between items-center mb-2">

                    <span className="text-slate-700 font-medium">
                      {
                        item.name
                      }
                    </span>

                    <span className="text-slate-900 font-semibold">
                      ₹
                      {
                        item.amount
                      }
                    </span>

                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${
                          (item.amount /
                            maxAmount) *
                          100
                        }%`,
                        backgroundColor:
                          item.color
                      }}
                    />

                  </div>

                </div>
              )
            )
          ) : (
            <div className="py-8 text-center text-slate-500">
              No expenses found.
            </div>
          )}

        </div>

      </div>

      {/* Right Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 min-h-[470px] hover:shadow-lg transition">

        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">
          Personal vs Group
        </h2>

       <div className="flex justify-center relative">

  <PieChart
    width={220}
    height={220}
  >
    <Pie
      data={splitData}
      dataKey="value"
      cx="50%"
      cy="50%"
      innerRadius={68}
      outerRadius={92}
      paddingAngle={2}
    >
      {splitData.map((item, index) => (
        <Cell
          key={index}
          fill={item.color}
        />
      ))}
    </Pie>
  </PieChart>

  <div
    className="
      absolute
      inset-0
      flex
      flex-col
      items-center
      justify-center
      pointer-events-none
    "
  >
    <p
      className="
        text-base
        md:text-xl
        font-bold
        text-center
        leading-tight
      "
    >
      ₹
      {grandTotal >= 10000000
        ? (grandTotal / 10000000).toFixed(1) + "Cr"
        : grandTotal >= 100000
        ? (grandTotal / 100000).toFixed(1) + "L"
        : grandTotal.toLocaleString("en-IN")}
    </p>

    <p className="text-slate-500 text-sm">
      Total
    </p>
  </div>

</div>

        {/* Legends */}
        <div className="space-y-4">

          {splitData.map(
            (item) => (
              <div
                key={
                  item.name
                }
                className="flex justify-between items-center"
              >

                <div className="flex items-center gap-3">

                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        item.color
                    }}
                  />

                  <span className="text-slate-700 font-medium">
                    {
                      item.name
                    }
                  </span>

                </div>

                <span className="text-slate-900 font-semibold">
                  ₹
                  {
                    item.value
                  }
                </span>

              </div>
            )
          )}

        </div>

      </div>

    </div>
    </div>
  )
}

export default DashboardCharts