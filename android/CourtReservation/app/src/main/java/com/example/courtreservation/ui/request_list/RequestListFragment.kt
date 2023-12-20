package com.example.courtreservation.ui.request_list

import android.os.AsyncTask
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.CheckBox
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.courtreservation.databinding.FragmentRequestListBinding
import com.example.courtreservation.ui.gallery.GalleryViewModel
import com.example.courtreservation.ui.login.LoginActivity
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

class RequestListFragment:Fragment() {
    private var _binding: FragmentRequestListBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        _binding = FragmentRequestListBinding.inflate(inflater, container, false)
        val root: View = binding.root
        val username = LoginActivity.Usersingleton.username.toString()
        fetchFriendRequests(username)
        binding.confirmButton.setOnClickListener {
            val selectedRequests = getSelectedFriendRequests()
            confirmFriendRequests(selectedRequests)
        }
        return root
    }
    private fun getSelectedFriendRequests(): List<Int> {
        val selectedRequests = mutableListOf<Int>()
        val linearLayout = binding.linearLayoutFriendRequests
        for (i in 0 until linearLayout.childCount) {
            val view = linearLayout.getChildAt(i)
            if (view is CheckBox && view.isChecked) {
                val userId = view.tag as? Int
                userId?.let { selectedRequests.add(it) }
            }
        }
        return selectedRequests
    }
    private fun confirmFriendRequests(selectedRequests: List<Int>) {
        // Convert the list to JSON Array
        val jsonBody = JSONObject().apply {
            val username = LoginActivity.Usersingleton.username
            put("user_name", username.toString())
            put("request_ids", JSONArray(selectedRequests))
        }

        // Define the URL for the Flask endpoint
        val url = "https://cloudnative.eastasia.cloudapp.azure.com/curtis/confirm_friend_requests"

        // Execute the AsyncTask to make the network request
        PostConfirmFriendRequestsTask().execute(url, jsonBody.toString())
    }
    private inner class PostConfirmFriendRequestsTask : AsyncTask<String, Void, String>() {
        override fun doInBackground(vararg params: String): String {
            val urlString = params[0]
            val jsonBodyString = params[1]

            try {
                val url = URL(urlString)
                with(url.openConnection() as HttpURLConnection) {
                    requestMethod = "POST"
                    doOutput = true
                    setRequestProperty("Content-Type", "application/json; charset=UTF-8")
                    outputStream.write(jsonBodyString.toByteArray(Charsets.UTF_8))
                    return inputStream.bufferedReader().use { it.readText() }
                }
            } catch (e: IOException) {
                e.printStackTrace()
                return ""
            }
        }

        override fun onPostExecute(result: String) {
            if (result.isNotEmpty()) {
                // Handle successful response
                Toast.makeText(context, "Friend requests confirmed", Toast.LENGTH_SHORT).show()
            } else {
                // Handle error
                Toast.makeText(context, "Error in confirming requests", Toast.LENGTH_SHORT).show()
            }
        }
    }
    private fun fetchFriendRequests(username: String) {
        val url = "https://cloudnative.eastasia.cloudapp.azure.com/curtis/get_friend_requests?username=$username"
        FetchFriendRequestsTask().execute(url)
    }

    private inner class FetchFriendRequestsTask : AsyncTask<String, Void, String>() {
        override fun doInBackground(vararg urls: String): String? {
            try {
                val url = URL(urls[0])
                with(url.openConnection() as HttpURLConnection) {
                    requestMethod = "GET"
                    return inputStream.bufferedReader().use { it.readText() }
                }
            } catch (e: IOException) {
                e.printStackTrace()
                return null
            }
        }

        override fun onPostExecute(result: String?) {
            if (result != null) {
                try {
                    val jsonResponse = JSONObject(result)
                    val friendRequests = jsonResponse.getJSONArray("friend_requests")
                    displayFriendRequests(friendRequests)
                } catch (e: JSONException) {
                    e.printStackTrace()
                    Toast.makeText(context, "Error parsing response: ${e.message}", Toast.LENGTH_LONG).show()
                }
            } else {
                Toast.makeText(context, "Network request failed", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun displayFriendRequests(friendRequests: JSONArray) {
        val linearLayout = binding.linearLayoutFriendRequests
        linearLayout.removeAllViews()
        var requestAdded = false

        for (i in 0 until friendRequests.length()) {
            val request = friendRequests.getJSONObject(i)

            // Check if the key "is_confirmed" exists in the JSON object
            if (request.has("is_confirmed")) {
                val isConfirmed = request.getString("is_confirmed")

                if (isConfirmed == "False") {
                    val userName = request.optString("user_name", "Unknown")
                    val age = request.optInt("age", -1)
                    val gender = request.optString("gender", "Unknown")
                    val height = request.optInt("height", -1)

                    val requestView = TextView(context).apply {
                        text = "Name: $userName, Age: $age, Gender: $gender, Height: $height"
                        layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
                    }

                    val checkBox = CheckBox(context).apply {
                        layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
                        tag = request.optInt("user_id", -1) // Default to -1 if user_id is not present
                    }

                    linearLayout.addView(requestView)
                    linearLayout.addView(checkBox)
                    requestAdded = true
                }
            }
        }

        if (!requestAdded) {
            val noRequestView = TextView(context).apply {
                text = "No friend requests to show"
                layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
            }
            linearLayout.addView(noRequestView)
        }
    }
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}