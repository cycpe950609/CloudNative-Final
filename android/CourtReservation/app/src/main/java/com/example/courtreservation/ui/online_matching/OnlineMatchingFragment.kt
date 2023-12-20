package com.example.courtreservation.ui.online_matching

import android.os.AsyncTask
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.CheckBox
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.courtreservation.R
import com.example.courtreservation.databinding.FragmentOnlineMatchingBinding
import com.example.courtreservation.ui.login.LoginActivity
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

class OnlineMatchingFragment:Fragment() {
    private var _binding: FragmentOnlineMatchingBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!
    private lateinit var userViews: List<Pair<TextView, CheckBox>>
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        _binding = FragmentOnlineMatchingBinding.inflate(inflater, container, false)
        val root: View = binding.root
        val onlineMatchingViewModel =
            ViewModelProvider(this).get(OnlineMatchingViewModel::class.java)
        userViews = listOf(
            Pair(binding.textViewUser1, binding.checkBox1),
            Pair(binding.textViewUser2, binding.checkBox2),
            Pair(binding.textViewUser3, binding.checkBox3),
            Pair(binding.textViewUser4, binding.checkBox4)
        )
        var bt1 = binding.findFriendBtn1
        bt1.setOnClickListener {
            bt1click(view)
        }
        binding.addFriendBtn1.setOnClickListener {
            onAddFriendClicked()
        }
        var bt2 = binding.findFriendBtn2
        bt2.setOnClickListener {
            bt2click(view)
        }
        binding.addFriendBtn2.setOnClickListener {
            onAddFriendBtn2Clicked()
        }
        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
    private fun bt1click(view: View?) {
        val ageLow = binding.ageLowIN.text.toString().toIntOrNull()
        val ageHigh = binding.ageHighIN.text.toString().toIntOrNull()
        val gender = when (binding.rgGender.checkedRadioButtonId) {
            R.id.rbMale -> "Male"
            R.id.rbFemale -> "Female"
            else -> ""  // or a default value
        }

        if (ageLow == null || ageHigh == null || ageLow > ageHigh) {
            // Show error - invalid age inputs
            Toast.makeText(context, "Invalid age range", Toast.LENGTH_LONG).show()
            return
        }
        fetchMatchingTeammates(ageLow, ageHigh, gender)
    }

    private fun fetchMatchingTeammates(ageLow: Int, ageHigh: Int, gender: String) {
        // Implement the logic to fetch teammates based on these constraints
        // This could involve making a network request to your backend
        val jsonBody = JSONObject().apply {
            put("ageLow", ageLow)
            put("ageHigh", ageHigh)
            put("gender", gender)
        }

        // Define the URL for the Flask endpoint
        val url = "https://cloudnative.eastasia.cloudapp.azure.com/curtis/find_teammates"

        // Execute the AsyncTask to make the network request
        FetchTeammatesTask().execute(url, jsonBody.toString())
    }
    private inner class FetchTeammatesTask : AsyncTask<String, Void, String>() {
        override fun doInBackground(vararg params: String): String {
            val urlString = params[0]
            val jsonBodyString = params[1]

            val url = URL(urlString)
            return with(url.openConnection() as HttpURLConnection) {
                // Set up HTTP post request
                requestMethod = "POST"
                doOutput = true
                setRequestProperty("Content-Type", "application/json; charset=UTF-8")
                outputStream.write(jsonBodyString.toByteArray())

                // Read the response
                inputStream.bufferedReader().use { it.readText() }
            }
        }
        override fun onPostExecute(result: String) {
            try {
                // Parse the JSON response
                val jsonArray = JSONArray(result)

                // Assuming you have four TextViews for four potential user matches
                val textViews = listOf(
                    binding.textViewUser1,
                    binding.textViewUser2,
                    binding.textViewUser3,
                    binding.textViewUser4
                )
                val checkboxs = listOf(
                    binding.checkBox1,
                    binding.checkBox2,
                    binding.checkBox3,
                    binding.checkBox4
                )
                for (i in 0 until jsonArray.length()) {
                    val user = jsonArray.getJSONObject(i)
                    val userInfo = "姓名: ${user.getString("user_name")}, " +
                            "年齡: ${user.getInt("age")}, " +
                            "性別: ${user.getString("gender")}, " +
                            "身高: ${user.getInt("height")}"

                    if (i < textViews.size) {
                        textViews[i].text = userInfo
                        textViews[i].tag = user.getString("user_name")
                        textViews[i].visibility = View.VISIBLE
                        checkboxs[i].visibility = View.VISIBLE
                    }
                }

            } catch (e: JSONException) {
                e.printStackTrace()
                // Handle JSON parsing error
                Toast.makeText(context, "Error parsing response", Toast.LENGTH_LONG).show()
            }
        }
    }
    private fun bt2click(view: View?) {
        val username = binding.editTextText17.text.toString()
        fetchProfileByUsername(username)
    }

    private fun fetchProfileByUsername(username: String) {
        FetchUserTask().execute("https://cloudnative.eastasia.cloudapp.azure.com/curtis/get_user_info?username=$username")
        // Make a GET request to the URL
        // Handle the response - parse JSON and update UI
    }
    private inner class FetchUserTask : AsyncTask<String, Void, String>() {
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
            if (result == null) {
                binding.searchResult.text = "User not found"
                println("Error occurred in fetch")
                // Handle the error appropriately
            } else {
                val jsonResponse = JSONObject(result)
                updateUI(jsonResponse)
            }
        }
    }
    private fun onAddFriendBtn2Clicked() {
        val selectedUsername = binding.editTextText17.text.toString()
        if (selectedUsername.isBlank()) {
            Toast.makeText(context, "Username is required", Toast.LENGTH_SHORT).show()
            return
        }

        sendFriendRequest(selectedUsername)
    }
    private fun sendFriendRequest(selectedUsername: String) {
        val requesterUsername = LoginActivity.Usersingleton.username.toString()
        val jsonBody = JSONObject().apply {
            put("username", requesterUsername)
            put("selectedUserIds", JSONArray().put(selectedUsername))
        }

        // URL of the Flask endpoint
        val url = "https://cloudnative.eastasia.cloudapp.azure.com/curtis/add_friendships"

        // Execute AsyncTask to send the request
        PostFriendRequestTask().execute(url, jsonBody.toString())
    }
    private fun onAddFriendClicked() {
        val selectedUserIds = mutableListOf<String>()

        userViews.forEach { (textView, checkBox) ->
            if (checkBox.isChecked) {
                // Assuming the tag of the textView contains the user ID
                val username = textView.tag as? String
                username?.let { selectedUserIds.add(it) }
            }
        }

        if (selectedUserIds.isEmpty()) {
            Toast.makeText(context, "Please select at least one user", Toast.LENGTH_SHORT).show()
        } else {
            sendFriendRequests(selectedUserIds)
        }
    }
    private fun sendFriendRequests(selectedUserIds: List<String>) {
        val username = LoginActivity.Usersingleton.username.toString()
        val jsonBody = JSONObject().apply {
            put("username", username)
            put("selectedUserIds", JSONArray(selectedUserIds))
        }

        // URL of the Flask endpoint
        val url = "https://cloudnative.eastasia.cloudapp.azure.com/curtis/add_friendships"

        // Execute AsyncTask to send the request
        PostFriendRequestTask().execute(url, jsonBody.toString())
    }
    private inner class PostFriendRequestTask : AsyncTask<String, Void, String>() {
        override fun doInBackground(vararg params: String): String {
            val urlString = params[0]
            val jsonBodyString = params[1]

            return try {
                val url = URL(urlString)
                with(url.openConnection() as HttpURLConnection) {
                    requestMethod = "POST"
                    doOutput = true
                    setRequestProperty("Content-Type", "application/json; charset=UTF-8")
                    outputStream.write(jsonBodyString.toByteArray(Charsets.UTF_8))
                    inputStream.bufferedReader().use { it.readText() }
                }
            } catch (e: IOException) {
                e.printStackTrace()
                ""
            }
        }

        override fun onPostExecute(result: String) {
            // Handle the response from the server
            if (result.isNotEmpty()) {
                // Process successful response
                Toast.makeText(context, "Friend request sent", Toast.LENGTH_SHORT).show()
            } else {
                // Handle error response
                Toast.makeText(context, "Error sending request", Toast.LENGTH_SHORT).show()
            }
        }
    }
    private fun updateUI(jsonResponse: JSONObject) {

        // Example of how to use the JSON data to update UI elements
        val txtresult = binding.textView19
        txtresult.visibility = View.VISIBLE
        val userName = jsonResponse.optString("user_name", "")
        val userAge = jsonResponse.optString("age", "")
        val userHeight = jsonResponse.optString("height", "")
        val userGender = jsonResponse.optString("gender", "")
        if (userName.isBlank()) {
            binding.searchResult.text = "User not found"
        } else {
            val userDetails = "名字: $userName\n年紀: $userAge\n" + "性別: $userGender\n身高: $userHeight"
            binding.searchResult.text = userDetails
        }
    }
}