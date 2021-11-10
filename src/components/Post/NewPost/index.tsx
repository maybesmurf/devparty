import { Card, CardBody } from '@components/UI/Card'
import { Tooltip } from '@components/UI/Tooltip'
import { Tab } from '@headlessui/react'
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  CollectionIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/outline'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import React, { Fragment } from 'react'

const PostType = dynamic(() => import('./Type/Post'), {
  loading: () => <Loading />
})
const QuestionType = dynamic(() => import('./Type/Question'), {
  loading: () => <Loading />
})
const TaskType = dynamic(() => import('./Type/Task'), {
  loading: () => <Loading />
})
const PollType = dynamic(() => import('./Type/Poll'), {
  loading: () => <Loading />
})
const IssueType = dynamic(() => import('./Type/Issue'), {
  loading: () => <Loading />
})

const Loading = () => <div className="shimmer rounded-lg h-10" />

const NewPost: React.FC = () => {
  return (
    <Card>
      <CardBody>
        <Tab.Group>
          <Tab.List className="flex space-x-5">
            <Tab as={Fragment}>
              {({ selected }) => (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={clsx(
                    { 'text-brand-500': selected },
                    { 'text-gray-400': !selected },
                    'flex items-center gap-1.5 text-sm tab-focus-ring'
                  )}
                >
                  <Tooltip content="Post">
                    <CollectionIcon className="h-5 w-5" />
                  </Tooltip>
                </motion.button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={clsx(
                    { 'text-brand-500': selected },
                    { 'text-gray-400': !selected },
                    'flex items-center gap-1.5 text-sm tab-focus-ring'
                  )}
                >
                  <Tooltip content="Task">
                    <CheckCircleIcon className="h-5 w-5" />
                  </Tooltip>
                </motion.button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={clsx(
                    { 'text-brand-500': selected },
                    { 'text-gray-400': !selected },
                    'flex items-center gap-1.5 text-sm tab-focus-ring'
                  )}
                >
                  <Tooltip content="Question">
                    <QuestionMarkCircleIcon className="h-5 w-5" />
                  </Tooltip>
                </motion.button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={clsx(
                    { 'text-brand-500': selected },
                    { 'text-gray-400': !selected },
                    'flex items-center gap-1.5 text-sm tab-focus-ring'
                  )}
                >
                  <Tooltip content="Poll">
                    <ChartBarIcon className="h-5 w-5" />
                  </Tooltip>
                </motion.button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={clsx(
                    { 'text-brand-500': selected },
                    { 'text-gray-400': !selected },
                    'flex items-center gap-1.5 text-sm tab-focus-ring'
                  )}
                >
                  <Tooltip content="GitHub Issue">
                    <ClipboardListIcon className="h-5 w-5" />
                  </Tooltip>
                </motion.button>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel className="focus:outline-none">
              <PostType />
            </Tab.Panel>
            <Tab.Panel className="focus:outline-none">
              <TaskType />
            </Tab.Panel>
            <Tab.Panel className="focus:outline-none">
              <QuestionType />
            </Tab.Panel>
            <Tab.Panel className="focus:outline-none">
              <PollType />
            </Tab.Panel>
            <Tab.Panel className="focus:outline-none">
              <IssueType />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </CardBody>
    </Card>
  )
}

export default NewPost
