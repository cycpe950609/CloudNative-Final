package com.example.courtreservation.network

import android.os.AsyncTask
import java.io.BufferedWriter
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

class PostDataTask(private val callback: (String?, Int) -> Unit) : AsyncTask<String, Void, Pair<String?, Int>>() {

    override fun doInBackground(vararg params: String?): Pair<String?, Int> {
        val urlString = params[0] // URL
        val postData = params[1] // JSON data

        var response: String? = null
        var responseCode: Int = -1
        try {
            val url = URL(urlString)
            val connection = url.openConnection() as HttpURLConnection
            connection.requestMethod = "POST"
            connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8")
            connection.doOutput = true
            connection.doInput = true

            postData?.let {
                BufferedWriter(OutputStreamWriter(connection.outputStream)).use { writer ->
                    writer.write(postData)
                    writer.flush()
                }
            }

            responseCode = connection.responseCode
            response = if (responseCode == HttpURLConnection.HTTP_OK) {
                connection.inputStream.bufferedReader().use { it.readText() }
            } else {
                connection.errorStream.bufferedReader().use { it.readText() }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return Pair(response, responseCode)
    }

    override fun onPostExecute(result: Pair<String?, Int>) {
        callback.invoke(result.first, result.second)
    }
}