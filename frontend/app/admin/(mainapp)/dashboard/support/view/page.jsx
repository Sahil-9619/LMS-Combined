"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SupportRequestsPage() {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:5000/api/contact/${id}`);

      if (!res.ok) throw new Error("Failed to fetch");

      const result = await res.json();

      // ✅ Ensure array always
      const safeData = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : [];

      setTickets(safeData);
    } catch (error) {
      console.error("Fetch Error:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Safe filtering (no crash even if fields missing)
  const filteredData = tickets.filter((req) => {
    const status = req?.status || "";
    const name = req?.name || "";
    const email = req?.email || "";

    const matchesStatus =
      statusFilter === "all" || status === statusFilter;

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Support Requests</h1>

        <div className="flex items-center gap-3 w-full max-w-lg">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Requests</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {tickets.length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-yellow-600">
            {tickets.filter((d) => d?.status === "open").length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Closed</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-600">
            {tickets.filter((d) => d?.status === "closed").length}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredData.map((req) => (
                  <TableRow key={req?._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {req?.name || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {req?.email || "N/A"}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{req?.subject || "-"}</TableCell>

                    <TableCell>
                      {req?.status === "open" && (
                        <Badge className="bg-yellow-500">Open</Badge>
                      )}
                      {req?.status === "in-progress" && (
                        <Badge className="bg-blue-500">In Progress</Badge>
                      )}
                      {req?.status === "closed" && (
                        <Badge className="bg-green-600">Closed</Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {req?.createdAt
                        ? new Date(req.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedTicket(req)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No support requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {selectedTicket && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
            />

            <motion.div
              className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl p-6 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Support Request Details
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedTicket(null)}
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {selectedTicket?.name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">
                    {selectedTicket?.email || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-medium">
                    {selectedTicket?.subject || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Message</p>
                  <div className="mt-2 p-4 bg-gray-100 rounded-lg text-sm">
                    {selectedTicket?.message || "No message provided."}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {selectedTicket?.createdAt
                      ? new Date(
                          selectedTicket.createdAt
                        ).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}