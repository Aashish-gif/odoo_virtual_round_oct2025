"use client"

import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/lib/currency"

export function AdminStats() {
  const { company } = useAuth()

  if (!company) return null

  const users = db.users.getByCompany(company.id)
  const expenses = db.expenses.getByCompany(company.id)

  const stats = {
    totalUsers: users.length,
    totalExpenses: expenses.length,
    pendingExpenses: expenses.filter((e) => e.status === "pending").length,
    approvedExpenses: expenses.filter((e) => e.status === "approved").length,
    rejectedExpenses: expenses.filter((e) => e.status === "rejected").length,
    totalAmount: expenses
      .filter((e) => e.status === "approved")
      .reduce((sum, e) => sum + (e.amountInCompanyCurrency || e.amount), 0),
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/5",
    },
    {
      title: "Total Expenses",
      value: stats.totalExpenses,
      icon: FileText,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/5",
    },
    {
      title: "Pending",
      value: stats.pendingExpenses,
      icon: Clock,
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-500/10 to-amber-600/5",
    },
    {
      title: "Approved",
      value: stats.approvedExpenses,
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-500/10 to-green-600/5",
    },
    {
      title: "Rejected",
      value: stats.rejectedExpenses,
      icon: XCircle,
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-500/10 to-red-600/5",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="card-hover border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`rounded-lg bg-gradient-to-br ${stat.bgGradient} p-2`}>
                  <Icon
                    className={`h-4 w-4 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}
                    style={{ WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500/10 via-card to-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-lg bg-green-500/10 p-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            Total Approved Amount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            {formatCurrency(stats.totalAmount, company.currency)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">All approved expenses in {company.currency}</p>
        </CardContent>
      </Card>
    </div>
  )
}
