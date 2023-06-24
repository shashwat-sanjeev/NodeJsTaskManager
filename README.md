# Task Manager APIs

Endpoints to perform basic CRUD operations on json file as in-memory datastore

## API Reference

#### Get list of all tasks

```http
  GET /tasks
```

#### Get task by Id

```http
  GET /tasks/${id}
```

| Parameter | Type      | Description                       |
| :-------- | :-------- | :-------------------------------- |
| `id`      | `integer` | **Required**. Id of task to fetch |

#### Create new task

```http
  POST /tasks
```

| Body Parameter | Type                                                | Description                    |
| :------------- | :-------------------------------------------------- | :----------------------------- |
| `title`        | `string`                                            | **Required**. Task Title       |
| `description`  | `string`                                            | **Required**. Task Description |
| `status`       | `string in ['pending', 'in-progress', 'completed']` | **Required**. Task Status      |

#### Update a task

```http
  PUT /tasks/${id}
```

| Body Parameter | Type                                                | Description                       |
| :------------- | :-------------------------------------------------- | :-------------------------------- |
| `title`        | `string`                                            | **Required**. Updated Title       |
| `description`  | `string`                                            | **Required**. Updated Description |
| `status`       | `string in ['pending', 'in-progress', 'completed']` | **Required**. Updated Status      |

#### Delete task by Id

```http
  DELETE /tasks/${id}
```

| Parameter | Type      | Description                        |
| :-------- | :-------- | :--------------------------------- |
| `id`      | `integer` | **Required**. Id of task to delete |

## Deployment

To deploy this project run

```bash
  npm run deploy
```

To start server

```bash
  npm run start
```
