"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ContactServices } from "@/services/contact.service";

export default function SupportRequestsPage() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await ContactServices.getContact();
      const result = res?.data || [];
      setTickets(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error(error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = tickets.filter((req) => {
    const name = req?.name || "";
    const email = req?.email || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );
    if (!confirmDelete) return;

    try {
        const res = await ContactServices.deleteContact(id);
      fetchTickets();
    } catch (error) {
      alert("Failed to delete ticket");
    }
  };

  return (
    <motion.div
      className="p-10 space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🔥 Modern Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Support Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage customer requests efficiently and professionally.
          </p>
        </div>

        <motion.div
          whileFocus={{ scale: 1.02 }}
          className="w-full md:w-[350px]"
        >
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 shadow-sm"
          />
        </motion.div>
      </div>

      {/* 🔥 Glass Card Table */}
      <Card className="backdrop-blur-xl bg-white/70 border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-lg text-muted-foreground">
              Loading support tickets...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableHead>User</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredData.map((req, index) => (
                  <motion.tr
                    key={req._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-indigo-50/40 transition-all"
                  >
                    <TableCell className="py-5">
                      <div>
                        <div className="font-semibold text-gray-800">
                          {req?.name || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {req?.email || "N/A"}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="max-w-[280px] truncate text-gray-700">
                      {req?.subject || "-"}
                    </TableCell>

                    <TableCell className="text-gray-600">
                      {req?.createdAt
                        ? new Date(req.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell className="text-right pr-6 space-x-2">
                      <Link
                        href={`/admin/dashboard/support/view/${req._id}`}
                      >
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-indigo-400 text-indigo-600 hover:bg-indigo-50"
                          >
                            View
                          </Button>
                        </motion.div>
                      </Link>

                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(req._id)}
                        >
                          Delete
                        </Button>
                      </motion.div>
                    </TableCell>
                  </motion.tr>
                ))}

                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-16 text-muted-foreground"
                    >
                      🚫 No support requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}