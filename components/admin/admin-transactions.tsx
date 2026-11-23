"use client"

import { useEffect, useState } from "react"
import { getAdminTransactions, type AdminTransactionData } from "@/lib/api"

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<AdminTransactionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getAdminTransactions()
      .then(setTransactions)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Could not load transactions."
        )
      )
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <p className="text-sm font-medium text-[#829778]">Admin dashboard</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e]">Transactions</h1>
      <p className="mt-2 text-sm text-[#74796f]">
        Payment records are read only and come from verified server events.
      </p>
      {error ? (
        <p
          role="alert"
          className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      ) : loading ? (
        <p className="mt-6 text-sm text-[#74796f]">Loading transactions…</p>
      ) : transactions.length === 0 ? (
        <p className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-[#74796f]">
          No transactions found.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[#e1dfd5] bg-white">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-[#f2f3ed] text-[#65705f]">
              <tr>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efeee8]">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#30362e]">
                      {transaction.vendorName}
                    </p>
                    <p className="text-xs text-[#74796f]">
                      {transaction.vendorEmail}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[#65705f] capitalize">
                    {transaction.plan || "—"}
                  </td>
                  <td className="px-4 py-3 text-[#30362e]">
                    {transaction.currency}{" "}
                    {Number(transaction.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#edf1e8] px-2.5 py-1 text-xs text-[#52604b] capitalize">
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#74796f]">
                    {transaction.createdAt
                      ? new Date(transaction.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
