"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [deleteId, setDeleteId] = useState(null); // 👈 NEW

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
    try {
      await ContactServices.deleteContact(id);
      fetchTickets();
      setDeleteId(null);
    } catch (error) {
      alert("Failed to delete ticket");
    }
  };

  return (
    <>
      {/* 🔥 Blur Background when modal open */}
      <div className={deleteId ? "blur-sm pointer-events-none" : ""}>
        <motion.div
          className="p-10 space-y-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Support Center
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage customer requests efficiently and professionally.
              </p>
            </div>

            <div className="w-full md:w-[350px]">
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 shadow-sm"
              />
            </div>
          </div>

          {/* TABLE CARD */}
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
                    {filteredData.map((req) => (
                      <TableRow key={req._id}>
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-indigo-400 text-indigo-600 hover:bg-indigo-50"
                            >
                              View
                            </Button>
                          </Link>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteId(req._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
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
      </div>

      {/* 🔥 Animated Modal */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
            />

            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px] text-center">
                <h2 className="text-xl font-semibold mb-4">
                  Delete Support Ticket?
                </h2>
                <p className="text-muted-foreground mb-6">
                  This action cannot be undone.
                </p>

                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteId(null)}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(deleteId)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}