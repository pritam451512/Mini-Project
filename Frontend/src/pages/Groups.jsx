// src/pages/Groups.jsx
// FULL CORRECT RESPONSIVE FILE
// LOGIC PRESERVED

import { useEffect, useState } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"

import {
  FiCopy,
  FiUsers,
  FiCheckCircle,
  FiXCircle
} from "react-icons/fi"

function Groups() {

  const navigate = useNavigate()

  const [groupName, setGroupName] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [createdGroups, setCreatedGroups] = useState([])
  const [joinedGroups, setJoinedGroups] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [groupDetails, setGroupDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {

    try {

      setLoading(true)

      const res =
        await api.get(
          "/api/group/info"
        )

      setCreatedGroups(
        res.data.created || []
      )

      setJoinedGroups(
        res.data.joined || []
      )

    } catch (err) {

      console.log(err)

      setMessage(
        "Failed to load groups"
      )

    } finally {

      setLoading(false)

    }
  }

  const handleCreate =
    async (e) => {

      e.preventDefault()

      try {

        setSubmitting(true)

        await api.post(
          "/api/group",
          {
            name:
              groupName.trim()
          }
        )

        setGroupName("")
        setShowCreate(false)

        fetchGroups()

      } catch (err) {

        console.log(err)

        setMessage(
          err.response?.data?.message ||
          "Failed to create group"
        )

      } finally {

        setSubmitting(false)

      }
    }

  const handleJoin =
    async (e) => {

      e.preventDefault()

      try {

        setSubmitting(true)

        await api.post(
          "/api/group/join",
          {
            code:
              inviteCode.trim()
          }
        )

        setInviteCode("")
        setShowJoin(false)

        fetchGroups()

      } catch (err) {

        console.log(err)

        setMessage(
          err.response?.data?.message ||
          "Failed to join group"
        )

      } finally {

        setSubmitting(false)

      }
    }

  const openGroupDetails =
    async (id) => {

      try {

        const res =
          await api.get(
            `/api/group/${id}`
          )

        setGroupDetails(
          res.data
        )

        setSelectedGroup(id)

      } catch (err) {

        console.log(err)

      }
    }

  const acceptRequest =
    async (userId) => {

      try {

        await api.post(
          "/api/group/approve",
          {
            groupId:
              selectedGroup,
            userId
          }
        )

        openGroupDetails(
          selectedGroup
        )

        fetchGroups()

      } catch (err) {

        console.log(err)

      }
    }

  const rejectRequest =
    async (userId) => {

      try {

        await api.post(
          "/api/group/reject",
          {
            groupId:
              selectedGroup,
            userId
          }
        )

        openGroupDetails(
          selectedGroup
        )

        fetchGroups()

      } catch (err) {

        console.log(err)

      }
    }

  const copyCode =
    async (code) => {

      try {

        await navigator.clipboard.writeText(
          code
        )

        setMessage(
          "Invite code copied"
        )

        setTimeout(() => {
          setMessage("")
        }, 2000)

      } catch (err) {

        console.log(err)

      }
    }

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <div className="max-w-[1800px] mx-auto px-4 md:px-16 lg:px-24 py-8">

        {/* Header */}
        <div className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-5
          mb-10
        ">

          <div>

            <h1 className="text-3xl md:text-5xl font-bold text-slate-900">
              Groups
            </h1>

            <p className="text-slate-500 text-base md:text-lg mt-2">
              Manage shared expenses beautifully
            </p>

          </div>

          <div className="
            flex
            flex-col
            sm:flex-row
            flex-wrap
            gap-3
            w-full
            xl:w-auto
          ">

            <button
              onClick={() =>
                setShowCreate(true)
              }
              className="
                w-full sm:w-auto
                px-6 py-3
                rounded-2xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                text-white
                font-semibold
                shadow
                hover:opacity-95
              "
            >
              + Create Group
            </button>

            <button
              onClick={() =>
                setShowJoin(true)
              }
              className="
                w-full sm:w-auto
                px-6 py-3
                rounded-2xl
                bg-white
                border
                border-slate-200
                font-semibold
                hover:bg-slate-100
              "
            >
              Join Group
            </button>

          </div>

        </div>

        {/* Message */}
        {
          message && (

            <div className="mb-6 bg-green-100 text-green-700 px-5 py-3 rounded-2xl">

              {message}

            </div>

          )
        }

        {
          loading ? (

            <div className="text-xl font-semibold text-slate-600">

              Loading...

            </div>

          ) : (

            <>

              {/* Created Groups */}
              <section className="mb-14">

                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">

                  Groups You Created

                </h2>

                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-3
                  gap-7
                ">

                  {
                    createdGroups.length === 0 ? (

                      <div className="text-slate-500">

                        No groups created yet

                      </div>

                    ) : (

                      createdGroups.map((group) => (

                        <div
                          key={group._id}
                          onClick={() =>
                            openGroupDetails(group._id)
                          }
                          className="
                            bg-white
                            rounded-3xl
                            border
                            border-slate-200
                            p-5 md:p-7
                            shadow-sm
                            hover:shadow-lg
                            cursor-pointer
                            transition
                          "
                        >

                          <div className="flex justify-between items-start mb-5">

                            <div>

                              <h3 className="text-xl md:text-2xl font-bold text-slate-900 uppercase">

                                {group.name}

                              </h3>

                              <p className="text-slate-500 mt-2 text-sm md:text-base">

                                Owner access enabled

                              </p>

                            </div>

                            <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600">

                              <FiUsers size={22} />

                            </div>

                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-8">

                            <div className="bg-slate-50 rounded-2xl p-4">

                              <p className="text-sm text-slate-500">
                                Members
                              </p>

                              <p className="text-2xl font-bold mt-1">
                                {group.members.length}
                              </p>

                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4">

                              <p className="text-sm text-slate-500">
                                Requests
                              </p>

                              <p className="text-2xl font-bold mt-1">
                                {group.requests.length}
                              </p>

                            </div>

                          </div>

                        </div>

                      ))
                    )
                  }

                </div>

              </section>

              {/* Joined Groups */}
              <section>

                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">

                  Joined Groups

                </h2>

                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-3
                  gap-7
                ">

                  {
                    joinedGroups.length === 0 ? (

                      <div className="text-slate-500">

                        No joined groups

                      </div>

                    ) : (

                      joinedGroups.map((group) => (

                        <div
                          key={group._id}
                          onClick={() =>
                            navigate(`/groups/${group._id}`)
                          }
                          className="
                            bg-white
                            rounded-3xl
                            border
                            border-slate-200
                            p-5 md:p-7
                            shadow-sm
                            hover:shadow-lg
                            cursor-pointer
                            transition
                          "
                        >

                          <h3 className="text-xl md:text-2xl font-bold uppercase text-slate-900">

                            {group.name}

                          </h3>

                          <p className="text-slate-500 mt-3 text-sm md:text-base">

                            Open group details

                          </p>

                        </div>

                      ))
                    )
                  }

                </div>

              </section>

            </>

          )
        }

      </div>

      {/* CREATE MODAL */}
      {
        showCreate && (

          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">

            <div className="
              bg-white
              w-full
              max-w-xl
              rounded-3xl
              p-4 md:p-8
            ">

              <div className="flex justify-between items-center mb-8">

                <h2 className="text-2xl md:text-3xl font-bold">
                  Create Group
                </h2>

                <button
                  onClick={() =>
                    setShowCreate(false)
                  }
                  className="text-3xl"
                >
                  ✕
                </button>

              </div>

              <form
                onSubmit={handleCreate}
                className="space-y-5"
              >

                <input
                  type="text"
                  value={groupName}
                  onChange={(e) =>
                    setGroupName(
                      e.target.value
                    )
                  }
                  placeholder="Enter group name"
                  className="
                    w-full
                    px-5 py-4
                    rounded-2xl
                    border
                    border-slate-300
                    outline-none
                    focus:border-cyan-500
                  "
                  required
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    w-full
                    py-4
                    rounded-2xl
                    bg-gradient-to-r
                    from-cyan-500
                    to-blue-600
                    text-white
                    font-semibold
                  "
                >

                  {
                    submitting
                      ? "Creating..."
                      : "Create Group"
                  }

                </button>

              </form>

            </div>

          </div>

        )
      }

      {/* JOIN MODAL */}
      {
        showJoin && (

          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">

            <div className="
              bg-white
              w-full
              max-w-xl
              rounded-3xl
              p-4 md:p-8
            ">

              <div className="flex justify-between items-center mb-8">

                <h2 className="text-2xl md:text-3xl font-bold">
                  Join Group
                </h2>

                <button
                  onClick={() =>
                    setShowJoin(false)
                  }
                  className="text-3xl"
                >
                  ✕
                </button>

              </div>

              <form
                onSubmit={handleJoin}
                className="space-y-5"
              >

                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) =>
                    setInviteCode(
                      e.target.value
                    )
                  }
                  placeholder="Enter invite code"
                  className="
                    w-full
                    px-5 py-4
                    rounded-2xl
                    border
                    border-slate-300
                    uppercase
                    outline-none
                    focus:border-cyan-500
                  "
                  required
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    w-full
                    py-4
                    rounded-2xl
                    bg-gradient-to-r
                    from-cyan-500
                    to-blue-600
                    text-white
                    font-semibold
                  "
                >

                  {
                    submitting
                      ? "Joining..."
                      : "Join Group"
                  }

                </button>

              </form>

            </div>

          </div>

        )
      }

      {/* DETAILS MODAL */}
      {
        groupDetails && (

          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">

            <div className="
              bg-white
              w-full
              max-w-2xl
              rounded-3xl
              p-4 md:p-8
              max-h-[90vh]
              overflow-y-auto
            ">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl md:text-3xl font-bold uppercase">

                  {groupDetails.name}

                </h2>

                <button
                  onClick={() =>
                    setGroupDetails(null)
                  }
                  className="text-3xl"
                >
                  ✕
                </button>

              </div>

              {/* Invite Code */}
              <div className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                gap-3
                mb-8
              ">

                <div className="
                  w-full
                  bg-slate-100
                  px-4 py-3
                  rounded-2xl
                  font-semibold
                  break-all
                ">

                  {groupDetails.inviteCode}

                </div>

                <button
                  onClick={() =>
                    copyCode(
                      groupDetails.inviteCode
                    )
                  }
                  className="
                    p-3
                    rounded-2xl
                    border
                    hover:bg-slate-100
                  "
                >

                  <FiCopy />

                </button>

              </div>

              <h3 className="text-2xl font-bold mb-5">

                Pending Requests

              </h3>

              {
                groupDetails.requests.length === 0 ? (

                  <p className="text-slate-500">

                    No requests pending

                  </p>

                ) : (

                  <div className="space-y-4">

                    {
                      groupDetails.requests.map((user) => (

                        <div
                          key={user._id}
                          className="
                            border
                            border-slate-200
                            rounded-2xl
                            p-5
                            flex
                            flex-col
                            sm:flex-row
                            gap-4
                            sm:items-center
                            sm:justify-between
                          "
                        >

                          <p className="font-semibold text-slate-800">

                            {user.name}

                          </p>

                          <div className="
                            flex
                            flex-col
                            sm:flex-row
                            gap-3
                            w-full
                            sm:w-auto
                          ">

                            <button
                              onClick={() =>
                                acceptRequest(
                                  user._id
                                )
                              }
                              className="
                                px-4 py-2
                                rounded-xl
                                bg-green-600
                                text-white
                                flex
                                items-center
                                justify-center
                                gap-2
                              "
                            >

                              <FiCheckCircle />

                              Accept

                            </button>

                            <button
                              onClick={() =>
                                rejectRequest(
                                  user._id
                                )
                              }
                              className="
                                px-4 py-2
                                rounded-xl
                                bg-red-500
                                text-white
                                flex
                                items-center
                                justify-center
                                gap-2
                              "
                            >

                              <FiXCircle />

                              Reject

                            </button>

                          </div>

                        </div>

                      ))
                    }

                  </div>

                )
              }

            </div>

          </div>

        )
      }

    </div>

  )
}

export default Groups