import { Layout } from 'antd'
import React from 'react'

const login2 = () => {
  return (
    <Layout title="Register - Ecommer App">
    <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" required />
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder="Password" required />
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
        <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              Forgot Password
            </button>
    </form>
    </Layout>
  )
}

export default login2