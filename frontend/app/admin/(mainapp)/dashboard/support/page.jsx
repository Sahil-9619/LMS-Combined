"use client";
import React, { useEffect, useState } from "react";
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
import Link from "next/link";

export default function SupportRequestsPage() {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch from backend
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/contact/all");

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const result = await res.json();

      // ✅ Handles both array & { data: [] }
      setTickets(Array.isArray(result) ? result : result.data || []);

    } catch (error) {
      console.error("Failed to fetch support tickets", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔎 Filtering
  const filteredData = tickets.filter((req) => {
    const matchesStatus =
      statusFilter === "all" || req.status === statusFilter;

    const matchesSearch =
      req?.name?.toLowerCase().includes(search.toLowerCase()) ||
      req?.email?.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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

      {/* Summary Cards */}
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
            {tickets.filter((d) => d.status === "open").length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Closed</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-600">
            {tickets.filter((d) => d.status === "closed").length}
          </CardContent>
        </Card>
      </div>

      {/* Table */}
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
                  <TableRow key={req._id}>
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

                    <TableCell>{req.subject}</TableCell>

                    <TableCell>
                      {req.status === "open" && (
                        <Badge className="bg-yellow-500 hover:bg-yellow-500">
                          Open
                        </Badge>
                      )}
                      {req.status === "in-progress" && (
                        <Badge className="bg-blue-500 hover:bg-blue-500">
                          In Progress
                        </Badge>
                      )}
                      {req.status === "closed" && (
                        <Badge className="bg-green-600 hover:bg-green-600">
                          Closed
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {req?.createdAt
                        ? new Date(req.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell className="text-right">
                     <Link href={`/admin/dashboard/support/${req._id}`}>
                      <Button variant="outline">View</Button>
                     </Link>
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
    </div>
  );
}