package com.example.courtreservation.ui.home

data class Announcement(val announcement_id: Int,
                        val writer_id: Int,
                        val start_date: String,
                        val end_date: String,
                        val title: String,
                        val content: String)
